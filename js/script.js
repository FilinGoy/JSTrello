const d = document;
const cl = console.log;

let lists = JSON.parse(localStorage.lists || "[]"); 
let card_num = JSON.parse(localStorage.card_num || 1);

const btnCreateList = d.getElementById("btn-create-list");
const desk = d.getElementById("desk");
const btnRemoveDesk = d.getElementById("btn-remove-desk");
const inputListName = d.getElementById("list-name");

for (let i in lists) {
    outputList(lists[i])        
}

function setAtrs(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key])
    }
}

function addList() {
    let listName = d.getElementById("list-name").value;
    if (listName == '') {
        listName = "Новый список " + card_num;
    }
    card_num++;
    localStorage.card_num = JSON.stringify(card_num);


    outputList(listName);
    lists.push(listName);
    localStorage.lists = JSON.stringify(lists);
}

// function changeList(list) {
//     let currentList = lists.indexOf(listName);
//     lists[currentList] = list;
//     localStorage.lists = JSON.stringify(lists);
// }

function outputList(listName) {
    let list = d.createElement("div");
    let h2 = d.createElement("h2");
    let div = d.createElement("div");
    div.classList.add("list-header");
    let img = d.createElement("img");
    setAtrs(img, { "src": "img/edit-solid.svg", "alt": "Редактировать название списка", "width": "20px"});
    let list2 = d.createElement("div");     // лист
    list2.classList.add("list-cards");
    let p = d.createElement("p");
    p.textContent="+ Добавить карточку";
    p.classList.add("add-card");
    let span = d.createElement("span");
    setAtrs(span, {"id":"delete-list"});
    img.classList.add("edit-list");
    
    h2.innerHTML = listName;

    span.innerHTML="✖";
    list.append(div);
    div.append(h2);
    div.append(img);
    div.append(span);
    h2.after(img);
    list.append(list2);
    list2.append(p);
    list.classList.add("list");
    desk.append(list);

    localStorage.lists = JSON.stringify(lists);
}

btnCreateList.addEventListener("click", addList);

btnRemoveDesk.addEventListener("click", function () {
    desk.innerHTML = "";
    card_num = 1
    lists = [];
    localStorage.card_num = JSON.stringify(card_num);
    localStorage.lists = JSON.stringify(lists);
})

// =============== Сегодня ================

inputListName.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnCreateList.click();
    }
});

function editList(e) {
    let obj = e.target;
    if (obj.classList.contains("edit-list")) {
        let list = obj.closest(".list")
        let h2 = list.querySelector("h2")
        h2.setAttribute("contenteditable", "true")
        h2.focus();
    }
    if (obj.id=="delete-list") {
        let list = obj.closest(".list");
        list.remove();

        let listName = list.closest("div").querySelector("h2").textContent;
        let currentList = lists.indexOf(listName);
        lists.splice(currentList, 1);
    }
    if(obj.classList.contains("add-card"))
    {
        let list = obj.closest(".list-cards");
        let div = d.createElement("div");
        let textarea = d.createElement("textarea");
        let span = d.createElement("span");

        div.classList.add("card");
        textarea.classList.add("card-text");
        span.innerHTML="✖";
        span.classList.add("delete-text")

        div.append(textarea);
        div.append(span);
        list.append(div);
        div.after(obj);
    }
    if(obj.classList.contains("delete-text"))
    {
        obj.closest(".card").remove();
    }
    localStorage.lists = JSON.stringify(lists);
}

desk.addEventListener("click", editList);
