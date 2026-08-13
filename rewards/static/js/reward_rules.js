document.addEventListener("DOMContentLoaded", function () {

    const checkbox =
        document.getElementById("agreeRules");

    const button =
        document.getElementById("continueBtn");


    // If the reward rules section is not on this page,
    // stop without causing a JavaScript error.
    if (!checkbox || !button) {
        return;
    }


    checkbox.addEventListener(
        "change",
        function () {

            if (checkbox.checked) {

                button.classList.remove("disabled");

            } else {

                button.classList.add("disabled");

            }

        }
    );

});