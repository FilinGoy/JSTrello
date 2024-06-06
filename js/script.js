const d = document;

let lists = JSON.parse(localStorage.getItem('lists') || "[]");
let listIdCounter = JSON.parse(localStorage.getItem('listIdCounter') || 1);
let cardIdCounter = JSON.parse(localStorage.getItem('cardIdCounter') || 1);

const desk = d.getElementById("desk");
const btnRemoveDesk = d.getElementById("btn-remove-desk");
const inputListName = d.getElementById("list-name");

const btnCreateList = d.getElementById("btn-create-list");
btnCreateList.addEventListener("click", addList);
inputListName.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); addList(); } });

desk.addEventListener("click", handleClick);
desk.addEventListener('input', handleInput);
desk.addEventListener('dragstart', handleDragStart);
desk.addEventListener('dragover', handleDragOver);
desk.addEventListener('dragend', handleDragEnd);
desk.addEventListener('drop', handleDrop);

btnRemoveDesk.addEventListener("click", resetDesk);

renderLists();

function renderLists() {
    lists.forEach(list => {
        renderList(list.id, list.name);
        list.cards.forEach(card => {
            renderCard(list.id, card.id, card.text);
        });
    });
}

function addList() {
    const listName = inputListName.value || `Новый список ${listIdCounter}`;
    const listId = `list-${listIdCounter++}`;
    localStorage.setItem('listIdCounter', JSON.stringify(listIdCounter));

    const newList = { id: listId, name: listName, cards: [] };
    lists.push(newList);
    localStorage.setItem('lists', JSON.stringify(lists));

    renderList(listId, listName);
    inputListName.value = '';
}

function renderList(listId, listName) {
    const list = d.createElement("div");
    list.classList.add("list");
    list.dataset.listId = listId;
    list.draggable = true;
    list.innerHTML = `
        <div class="list-header">
            <h2 contenteditable="true">${listName}</h2>
            <span class="delete-list">✖</span>
        </div>
        <hr>
        <div class="list-cards"></div>
        <hr>
        <div class="add-card">+ Добавить карточку</div>
    `;
    desk.appendChild(list);
}

function renderCard(listId, cardId, cardText) {
    const list = desk.querySelector(`[data-list-id="${listId}"]`);
    const listCards = list.querySelector(".list-cards");
    const card = d.createElement("div");
    card.classList.add("card");
    card.dataset.cardId = cardId;
    card.draggable = true;
    card.innerHTML = `
        <textarea class="card-text" rows="2" placeholder="Введите текст карточки">${cardText}</textarea>
        <span class="delete-text">✖</span>
    `;
    listCards.appendChild(card);
}

function handleClick(e) {
    const list = e.target.closest(".list");
    if (e.target.classList.contains("add-card")) {
        const listId = list.dataset.listId;
        const listCards = list.querySelector(".list-cards");
        const existingTextarea = listCards.querySelector('.card-text.new');
        if (!existingTextarea) {
            const textarea = document.createElement('textarea');
            textarea.classList.add('card-text', 'new');
            textarea.rows = 2;
            textarea.placeholder = "Введите текст карточки";
            listCards.appendChild(textarea);
            textarea.focus();
            textarea.addEventListener('blur', handleTextareaBlur);
            textarea.addEventListener('keydown', handleTextareaKeydown);
        }
    } else if (e.target.classList.contains("delete-list")) {
        const listId = list.dataset.listId;
        lists = lists.filter(l => l.id !== listId);
        localStorage.setItem('lists', JSON.stringify(lists));
        list.remove();
    } else if (e.target.classList.contains("delete-text")) {
        const cardElement = e.target.closest('.card');
        if (cardElement) {
            const cardId = cardElement.dataset.cardId;
            const listId = cardElement.closest('.list').dataset.listId;
            const listIndex = lists.findIndex(l => l.id === listId);
            lists[listIndex].cards = lists[listIndex].cards.filter(card => card.id !== cardId);
            localStorage.setItem('lists', JSON.stringify(lists));
            cardElement.remove();
        }
    }
}

function handleTextareaBlur() {
    const text = this.value.trim();
    if (text !== '') {
        addCard(this);
    }
    this.remove();
}

function handleTextareaKeydown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const text = this.value.trim();
        if (text !== '') {
            addCard(this);
        }
        this.remove();
    }
}

function addCard(textarea) {
    const list = textarea.closest('.list');
    const listId = list.dataset.listId;
    const inputText = textarea.value.trim();
    if (inputText === '') return;
    const cardId = `card-${cardIdCounter++}`;
    localStorage.setItem('cardIdCounter', JSON.stringify(cardIdCounter));
    const listIndex = lists.findIndex(l => l.id === listId);
    lists[listIndex].cards.push({ id: cardId, text: inputText });
    localStorage.setItem('lists', JSON.stringify(lists));
    renderCard(listId, cardId, inputText);
}

function handleInput(e) {
    if (e.target.matches(".list h2")) {
        const listId = e.target.closest(".list").dataset.listId;
        const newName = e.target.textContent;
        const listIndex = lists.findIndex(l => l.id === listId);
        lists[listIndex].name = newName;
        localStorage.setItem('lists', JSON.stringify(lists));
    } else if (e.target.matches(".card-text")) {
        const cardElement = e.target.closest('.card');
        if (cardElement) {
            const cardId = cardElement.dataset.cardId;
            const listElement = e.target.closest('.list');
            if (listElement) {
                const listId = listElement.dataset.listId;
                const cardText = e.target.value;
                const listIndex = lists.findIndex(l => l.id === listId);
                if (listIndex !== -1) {
                    const cardIndex = lists[listIndex].cards.findIndex(c => c.id === cardId);
                    if (cardIndex !== -1) {
                        lists[listIndex].cards[cardIndex].text = cardText;
                        localStorage.setItem('lists', JSON.stringify(lists));
                    }
                }
            }
        }
    }
}

function resetDesk() {
    desk.innerHTML = "";
    listIdCounter = 1;
    cardIdCounter = 1;
    lists = [];
    localStorage.setItem('listIdCounter', JSON.stringify(listIdCounter));
    localStorage.setItem('cardIdCounter', JSON.stringify(cardIdCounter));
    localStorage.setItem('lists', JSON.stringify(lists));
    renderLists();
}

function handleDragStart(e) {
    if (e.target.classList.contains('card')) {
        e.target.classList.add('dragging');
        draggingFromListId = e.target.closest('.list').dataset.listId;
    } else if (e.target.classList.contains('list')) {
        e.target.classList.add('dragging-list');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const draggingCard = desk.querySelector('.dragging');
    const draggingList = desk.querySelector('.dragging-list');
    if (draggingCard) {
        const listContainer = e.target.closest('.list-cards');
        if (listContainer) {
            const afterElement = getDragAfterElement(listContainer, e.clientY);
            if (afterElement == null) {
                listContainer.appendChild(draggingCard);
            } else {
                listContainer.insertBefore(draggingCard, afterElement);
            }
        }
    }
    if (draggingList) {
        const afterElement = getDragAfterElement(desk, e.clientX, true);
        if (afterElement == null) {
            desk.appendChild(draggingList);
        } else {
            desk.insertBefore(draggingList, afterElement);
        }
    }
}

function handleDragEnd(e) {
    if (e.target.classList.contains('card')) {
        e.target.classList.remove('dragging');
        const listId = e.target.closest('.list').dataset.listId;
        saveCardOrder(listId);
    } else if (e.target.classList.contains('list')) {
        e.target.classList.remove('dragging-list');
        saveListOrder();
    }
}

function handleDrop(e) {
    e.preventDefault();
    const draggingCard = desk.querySelector('.dragging');
    const draggingList = desk.querySelector('.dragging-list');
    if (draggingCard) {
        const listContainer = e.target.closest('.list-cards');
        if (listContainer) {
            const afterElement = getDragAfterElement(listContainer, e.clientY);
            if (afterElement == null) {
                listContainer.appendChild(draggingCard);
            } else {
                listContainer.insertBefore(draggingCard, afterElement);
            }
            const newListId = listContainer.closest('.list').dataset.listId;
            const cardId = draggingCard.dataset.cardId;
            moveCardToList(draggingFromListId, newListId, cardId);
        }
    }
    if (draggingList) {
        const afterElement = getDragAfterElement(desk, e.clientX, true);
        if (afterElement == null) {
            desk.appendChild(draggingList);
        } else {
            desk.insertBefore(draggingList, afterElement);
        }
    }
    draggingFromListId = null;
}

function getDragAfterElement(container, y, isList = false) {
    const draggableElements = [...container.querySelectorAll(isList ? '.list:not(.dragging-list)' : '.card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = isList ? (y - box.left - box.width / 2) : (y - box.top - box.height / 2);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function moveCardToList(oldListId, newListId, cardId) {
    const oldList = lists.find(l => l.id === oldListId);
    const newList = lists.find(l => l.id === newListId);
    const cardIndex = oldList.cards.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
        const card = oldList.cards.splice(cardIndex, 1)[0];
        newList.cards.push(card);
        localStorage.setItem('lists', JSON.stringify(lists));
    }
}

function saveCardOrder(listId) {
    const list = lists.find(l => l.id === listId);
    const listElement = desk.querySelector(`[data-list-id="${listId}"]`);
    const cardElements = listElement.querySelectorAll('.card');
    const cards = [];
    cardElements.forEach(cardElement => {
        const cardId = cardElement.dataset.cardId;
        const cardText = cardElement.querySelector('.card-text').value;
        cards.push({ id: cardId, text: cardText });
    });
    list.cards = cards;
    localStorage.setItem('lists', JSON.stringify(lists));
}

function saveListOrder() {
    const listElements = desk.querySelectorAll('.list');
    const orderedLists = [];
    listElements.forEach(listElement => {
        const listId = listElement.dataset.listId;
        const list = lists.find(l => l.id === listId);
        orderedLists.push(list);
    });
    lists = orderedLists;
    localStorage.setItem('lists', JSON.stringify(lists));
}