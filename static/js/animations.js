/*=========================================================
                    AOS ANIMATION
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    AOS.init({

        duration:900,

        once:true,

        offset:80,

        easing:"ease-in-out",

        mirror:false

    });

});


window.addEventListener("load", function () {

    AOS.refreshHard();

});

/*=========================================================
        MOBILE AOS FIX
=========================================================*/

window.addEventListener("pageshow", function () {

    AOS.refreshHard();

});

window.addEventListener("resize", function () {

    AOS.refreshHard();

});

window.addEventListener("orientationchange", function () {

    AOS.refreshHard();

});

window.addEventListener("scroll", function () {

    AOS.refreshHard();

}, { passive: true });