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

// =========================================
// INITIAL THEME
// =========================================

const savedTheme = localStorage.getItem("theme");

if(savedTheme){

    setTheme(savedTheme);

}else{

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(prefersDark ? "dark" : "light");

}

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

// =========================================
// FOLLOW PHONE THEME
// =========================================

window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", function(e){

    // Only follow the phone if the user
    // hasn't manually selected a theme.
    if(!localStorage.getItem("theme")){

        setTheme(e.matches ? "dark" : "light");

    }

});

});