/*=========================================================
                    AOS ANIMATION
=========================================================*/

function initAOS() {

    AOS.init({

        duration:900,

        once:true,

        offset:80,

        easing:"ease-in-out",

        mirror:false

    });

}

// Run immediately
initAOS();

// Refresh after everything (images/fonts) has loaded
window.addEventListener("load", function () {

    AOS.refreshHard();

});

// Refresh on resize
window.addEventListener("resize", function () {

    AOS.refreshHard();

});

// Refresh when device orientation changes
window.addEventListener("orientationchange", function () {

    AOS.refreshHard();

});