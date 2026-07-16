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

window.addEventListener("load", function(){

    AOS.refresh();

});