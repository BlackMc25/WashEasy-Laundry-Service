

document.addEventListener("DOMContentLoaded", function () {

/*=========================================================
                DARK/LIGHT MODE
=========================================================*/

const desktopBtn=document.getElementById("themeToggleDesktop");

const mobileBtn=document.getElementById("themeToggleMobile");

function updateIcons(theme){

const iconClass=

theme==="dark"

?"bi bi-sun-fill"

:"bi bi-moon-stars-fill";

if(desktopBtn){

desktopBtn.querySelector("i").className=iconClass;

}

if(mobileBtn){

mobileBtn.querySelector("i").className=iconClass;

}

}

function setTheme(theme){

document.body.classList.remove("light","dark");

document.body.classList.add(theme);

localStorage.setItem("theme",theme);

updateIcons(theme);

}

const savedTheme=localStorage.getItem("theme")||"light";

setTheme(savedTheme);

function toggleTheme(){

if(document.body.classList.contains("dark")){

setTheme("light");

}

else{

setTheme("dark");

}

}

if(desktopBtn){

desktopBtn.addEventListener("click",toggleTheme);

}

if(mobileBtn){

mobileBtn.addEventListener("click",toggleTheme);

}

});