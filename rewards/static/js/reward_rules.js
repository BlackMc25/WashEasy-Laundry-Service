document.addEventListener("DOMContentLoaded", function () {

    const checkbox = document.getElementById("agreeRules");

    const button = document.getElementById("continueBtn");

    checkbox.addEventListener("change", function () {

        if (checkbox.checked){

            button.classList.remove("disabled");

        }else{

            button.classList.add("disabled");

        }

    });

});