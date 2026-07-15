/*=========================================================
                NAVBAR SCROLL EFFECT
=========================================================*/

window.addEventListener("scroll",()=>{

    const navbar=document.querySelector(".navbar");

    if(window.scrollY>80){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});