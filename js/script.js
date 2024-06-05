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

    card.innerHTML = `
        <textarea class="card-text" rows="2" placeholder="Введите текст карточки">${cardText}</textarea>
        <span class="delete-text">✖</span>
    `;

    listCards.appendChild(card);
}

function addCard(listId, inputText) {
    if (inputText.trim() === '') return; // Если текст пустой, не добавляем карточку

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

        const textarea = document.createElement('textarea');
        textarea.classList.add('card-text');
        textarea.rows = 2;
        textarea.placeholder = "Введите текст карточки";
        listCards.appendChild(textarea);

        textarea.focus();

        textarea.addEventListener('blur', function () {
            const text = textarea.value.trim();
            if (text !== '') {
                addCard(listId, text);
                textarea.remove();
            } else {
                textarea.remove();
            }
        });

        textarea.addEventListener('keydown', function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                const text = textarea.value.trim();
                if (text !== '') {
                    addCard(listId, text);
                    textarea.remove();
                } else {
                    textarea.remove();
                }
            }
        });
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

desk.addEventListener("input", e => {
    if (e.target.matches(".list h2")) {
        let listId = e.target.closest(".list").dataset.listId;
        let newName = e.target.textContent;
        let listIndex = lists.findIndex(l => l.id === listId);
        lists[listIndex].name = newName;
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    if (e.target.matches(".card-text")) {
        let cardId = e.target.closest('.card').dataset.cardId;
        let listId = e.target.closest('.list').dataset.listId;
        let cardText = e.target.value;
        let listIndex = lists.findIndex(l => l.id === listId);
        let cardIndex = lists[listIndex].cards.findIndex(c => c.id === cardId);
        lists[listIndex].cards[cardIndex].text = cardText;
        localStorage.setItem('lists', JSON.stringify(lists));
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
    listIdCounter = 1;
    cardIdCounter = 1;
    lists = [];
    localStorage.setItem('listIdCounter', JSON.stringify(listIdCounter));
    localStorage.setItem('cardIdCounter', JSON.stringify(cardIdCounter));
    localStorage.setItem('lists', JSON.stringify(lists));
});
