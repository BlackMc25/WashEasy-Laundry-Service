document.addEventListener("DOMContentLoaded", () => {

    const inputs = document.querySelectorAll(".otp-input");
    const form = document.querySelector("form");

    /*=====================================
        AUTO MOVE
    =====================================*/

    inputs.forEach((input, index) => {

        input.addEventListener("input", (e) => {

            let value = e.target.value;

            // Only allow numbers
            value = value.replace(/\D/g, "");

            e.target.value = value;

            if (value.length === 1 && index < inputs.length - 1) {

                inputs[index + 1].focus();

            }

            // Auto-submit when all boxes are filled
            const completed = [...inputs].every(box => box.value !== "");

            if (completed) {

                setTimeout(() => {

                    form.submit();

                }, 200);

            }

        });

    });

    /*=====================================
        BACKSPACE
    =====================================*/

    inputs.forEach((input, index) => {

        input.addEventListener("keydown", (e) => {

            if (

                e.key === "Backspace" &&

                input.value === "" &&

                index > 0

            ) {

                inputs[index - 1].focus();

            }

        });

    });

    /*=====================================
        PASTE SUPPORT
    =====================================*/

    inputs[0].addEventListener("paste", (e) => {

        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        pasted.split("").forEach((digit, index) => {

            if (inputs[index]) {

                inputs[index].value = digit;

            }

        });

        if (pasted.length === 6) {

            form.submit();

        }

    });

    /*=====================================
        COUNTDOWN
    =====================================*/

    const resendLink = document.getElementById("resendLink");
    const countdown = document.getElementById("countdown");

    let seconds = 60;

    resendLink.style.pointerEvents = "none";
    resendLink.style.opacity = "0.5";

    const timer = setInterval(() => {

        seconds--;

        countdown.textContent = "(" + seconds + "s)";

        if (seconds <= 0) {

            clearInterval(timer);

            countdown.textContent = "";

            resendLink.style.pointerEvents = "auto";
            resendLink.style.opacity = "1";

        }

    }, 1000);

});