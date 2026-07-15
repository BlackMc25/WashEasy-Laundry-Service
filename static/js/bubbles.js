/*=========================================================
                FLOATING BACKGROUND BUBBLES
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ Bubble JS Loaded");

    /*---------------------------------------
        Background Floating Bubbles
    ---------------------------------------*/

    const bubblesContainer = document.querySelector(".bubbles");

    if (bubblesContainer) {

        for (let i = 0; i < 20; i++) {

            const bubble = document.createElement("span");

            bubble.className = "bubble";

            bubble.style.left = Math.random() * 100 + "%";

            bubble.style.animationDelay = Math.random() * 6 + "s";

            bubble.style.animationDuration = (5 + Math.random() * 6) + "s";

            bubble.style.width = (8 + Math.random() * 18) + "px";

            bubble.style.height = bubble.style.width;

            bubblesContainer.appendChild(bubble);

        }

    }

    /*---------------------------------------
        Clickable Glass Bubbles
    ---------------------------------------*/

    const bubbles = document.querySelectorAll(".glass-circle, .modal-bubble");

    console.log("Bubbles Found:", bubbles.length);

    const popup = document.getElementById("bubblePopup");
    const popupIcon = document.getElementById("popupIcon");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");

    if (!popup) return;

    bubbles.forEach(function (bubble) {
        
        bubbles.forEach((bubble) => {

            bubble.addEventListener("click", function () {

                console.log("Bubble clicked!");

            });

        });
    });

    /*---------------------------------------
        Close Popup
    ---------------------------------------*/

    popup.addEventListener("click", function (e) {

        if (
            e.target === popup ||
            e.target.closest(".popup-card")
        ) {

            popup.classList.remove("show");

        }

    });

});