const d = document;

let lists = JSON.parse(localStorage.getItem('lists') || "[]");
let listIdCounter = JSON.parse(localStorage.getItem('listIdCounter') || 1);
let cardIdCounter = JSON.parse(localStorage.getItem('cardIdCounter') || 1);

const btnCreateList = d.getElementById("btn-create-list");
const desk = d.getElementById("desk");
const btnRemoveDesk = d.getElementById("btn-remove-desk");
const inputListName = d.getElementById("list-name");

lists.forEach(list => {
    renderList(list.id, list.name);
    list.cards.forEach(card => {
        renderCard(list.id, card.id, card.text);
    });
});

function addList() {
    let listName = inputListName.value || `Новый список ${listIdCounter}`;
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
            <span id="delete-list">✖</span>
        </div>
        <div class="list-cards"></div>
        <p class="add-card">+ Добавить карточку</p>
    `;

    desk.appendChild(list);
}

function renderCard(listId, cardId, cardText) {
    let list = desk.querySelector(`[data-list-id="${listId}"]`);
    let listCards = list.querySelector(".list-cards");

    let card = d.createElement("div");
    card.classList.add("card");
    card.dataset.cardId = cardId;
    card.draggable = true;

    card.innerHTML = `
        <textarea class="card-text" rows="2" placeholder="Введите текст карточки">${cardText}</textarea>
        <span class="delete-text">✖</span>
    `;

    listCards.appendChild(card);
}

function addCard(listId, inputText) {
    if (inputText.trim() === '') return;

    const cardId = `card-${cardIdCounter++}`;
    localStorage.setItem('cardIdCounter', JSON.stringify(cardIdCounter));

    let list = lists.find(l => l.id === listId);
    list.cards.push({ id: cardId, text: inputText });
    localStorage.setItem('lists', JSON.stringify(lists));

    renderCard(listId, cardId, inputText);
}

desk.addEventListener("click", e => {
    const list = e.target.closest(".list");

    if (e.target.id === "delete-list") {
        let listId = list.dataset.listId;
        lists = lists.filter(l => l.id !== listId);
        localStorage.setItem('lists', JSON.stringify(lists));
        list.remove();
    }

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

            textarea.addEventListener('blur', function () {
                const text = textarea.value.trim();
                if (text !== '') {
                    addCard(listId, text);
                }
                textarea.remove();
            });

            textarea.addEventListener('keydown', function (event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    const text = textarea.value.trim();
                    if (text !== '') {
                        addCard(listId, text);
                    }
                    textarea.remove();
                }
            });
        }
    }

    if (e.target.classList.contains("delete-text")) {
        let cardElement = e.target.closest('.card');
        if (cardElement) {
            let cardId = cardElement.dataset.cardId;
            let listId = cardElement.closest('.list').dataset.listId;
            let listIndex = lists.findIndex(l => l.id === listId);
            lists[listIndex].cards = lists[listIndex].cards.filter(card => card.id !== cardId);
            localStorage.setItem('lists', JSON.stringify(lists));
            cardElement.remove();
        }
    }
});

desk.addEventListener('input', e => {
    if (e.target.matches(".list h2")) {
        let listId = e.target.closest(".list").dataset.listId;
        let newName = e.target.textContent;
        let listIndex = lists.findIndex(l => l.id === listId);
        lists[listIndex].name = newName;
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    if (e.target.matches(".card-text")) {
        let cardElement = e.target.closest('.card');
        if (cardElement) {
            let cardId = cardElement.dataset.cardId;
            let listElement = e.target.closest('.list');
            if (listElement) {
                let listId = listElement.dataset.listId;
                let cardText = e.target.value;
                let listIndex = lists.findIndex(l => l.id === listId);
                if (listIndex !== -1) {
                    let cardIndex = lists[listIndex].cards.findIndex(c => c.id === cardId);
                    if (cardIndex !== -1) {
                        lists[listIndex].cards[cardIndex].text = cardText;
                        localStorage.setItem('lists', JSON.stringify(lists));
                    }
                }
            }
        }
    }

});

btnCreateList.addEventListener("click", addList);
inputListName.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        addList();
    }
});

btnRemoveDesk.addEventListener("click", () => {
    desk.innerHTML = "";
    listIdCounter = 4;
    cardIdCounter = 10;
    lists = [{ "id": "list-1", "name": "Новый список 1", "cards": [{ "id": "card-1", "text": "11" }, { "id": "card-2", "text": "12" }, { "id": "card-3", "text": "13" }] }, { "id": "list-2", "name": "Новый список 2", "cards": [{ "id": "card-4", "text": "21" }, { "id": "card-5", "text": "22" }, { "id": "card-6", "text": "23" }] }, { "id": "list-3", "name": "Новый список 3", "cards": [{ "id": "card-7", "text": "31" }, { "id": "card-8", "text": "32" }, { "id": "card-9", "text": "33" }] }];
    localStorage.setItem('listIdCounter', JSON.stringify(listIdCounter));
    localStorage.setItem('cardIdCounter', JSON.stringify(cardIdCounter));
    localStorage.setItem('lists', JSON.stringify(lists));

    lists.forEach(list => {
        renderList(list.id, list.name);
        list.cards.forEach(card => {
            renderCard(list.id, card.id, card.text);
        });
    });
});

let draggingFromListId = null;

desk.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('card')) {
        e.target.classList.add('dragging');
        draggingFromListId = e.target.closest('.list').dataset.listId;
    }
    if (e.target.classList.contains('list')) {
        e.target.classList.add('dragging-list');
    }
});

desk.addEventListener('drop', (e) => {
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
});

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

desk.addEventListener('dragover', (e) => {
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
});

desk.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('card')) {
        e.target.classList.remove('dragging');
        const listId = e.target.closest('.list').dataset.listId;
        saveCardOrder(listId);
    }
    if (e.target.classList.contains('list')) {
        e.target.classList.remove('dragging-list');
        saveListOrder();
    }
});


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