const elems = document.querySelectorAll(".menu_item a");
for (let elem of elems) {
    elem.setAttribute("href", "https://midis.ru/")
}   

const bl3 = document.getElementById("block3");
bl3.innerHTML = "новый <b>блок</b>";

bl3.setAttribute("class", "bg-red");
bl3.classList.add("big-text");
bl3.classList.remove("big-text");
console.log(bl3.classList.contains("bg-red"));

bl3.addEventListener("click",function (){
    bl3.classList.toggle("bg-red");
});

bl3.style.color = "green";
bl3.style.fontStyle = "italic";


/*------создание нового элемента--------*/
let newElem = document.createElement("h1");
newElem.textContent = "Заголовок 1";
let body = document.querySelector("body");
//body.prepend(newElem);

let bl2 = document.getElementById("block2");
bl2.before(newElem);

/*---------Удаление элементов------------- */

let bl1 = document.getElementById("block1");
bl1.remove();

/*------клонирование элементов---------- */

let newBlock = bl2.cloneNode(true);
body.append(newBlock);

/*-----предки и потомки------- */
let lorem = document.querySelector(".lorem");
let pred = lorem.closest("p");
pred.classList.add("bg-red");

console.log(bl2.querySelectorAll("li"));