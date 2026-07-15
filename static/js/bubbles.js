
/*=========================================================
                BUBBLE TEST
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ Bubble JS Loaded");

    const bubbles = document.querySelectorAll(".glass-circle, .modal-bubble");

    console.log("Bubbles Found:", bubbles.length);

    bubbles.forEach(function(bubble){

        bubble.style.border = "3px solid red";

        bubble.addEventListener("click", function(){

            alert("Bubble Clicked!");

        });

    });

});


/*=========================================================
                FLOATING SOAP BUBBLES
=========================================================*/

const bubbles=document.querySelector(".bubbles");

if(bubbles){for(let i=0;i<20;i++){

    const bubble=document.createElement("span");

    bubble.className="bubble";

    bubble.style.left=Math.random()*100+"%";

    bubble.style.animationDelay=Math.random()*6+"s";

    bubble.style.animationDuration=5+Math.random()*6+"s";

    bubble.style.width=8+Math.random()*18+"px";

    bubble.style.height=bubble.style.width;

    bubbles.appendChild(bubble);

}

}
