

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================
                SUBSCRIPTION PLAN SELECTION
========================================================== */

const planCards =
    document.querySelectorAll(".plan-card");

const continueButton =
    document.getElementById(
        "continueSubscription"
    );

const selectedPlanInput =
    document.getElementById(
        "selected-plan"
    );

/* ==========================================================
                SELECT PLAN
========================================================== */

const planButtons =
    document.querySelectorAll(".select-plan-btn");

planButtons.forEach(button => {

    button.addEventListener("click", function () {

        const card =
            this.closest(".plan-card");

        planCards.forEach(c => {

            c.classList.remove("selected");

        });

        card.classList.add("selected");

        selectedPlanInput.value =
            card.dataset.plan;

        continueButton.disabled = false;

    });

});

/*==========================================================
                STEP NAVIGATION
==========================================================*/

const step1 =
    document.getElementById(
        "subscription-step1"
    );

const step2 =
    document.getElementById(
        "subscription-step2"
    );

const nextButton =
    document.getElementById(
        "continueSubscription"
    );

const backButton =
    document.getElementById(
        "subscriptionBack1"
    );

const nextStep2 =
    document.getElementById(
        "subscriptionNext2"
    );

/* Step 1 -> Step 2 */

nextButton.addEventListener(
    "click",
    function(){

        step1.style.display="none";

        step2.style.display="block";

    }
);

/* Step 2 -> Step 1 */

backButton.addEventListener(
    "click",
    function(){

        step2.style.display="none";

        step1.style.display="block";

    }
);

/*==========================================================
                STEP 2 -> STEP 3
==========================================================*/

const step3 =
    document.getElementById(
        "subscription-step3"
    );

const backStep2 =
    document.getElementById(
        "subscriptionBack2"
    );

nextStep2.addEventListener(

    "click",

    function(){

        document.getElementById(
            "review-pickup"
        ).innerText =
        document.getElementById(
            "subscription-pickup"
        ).value;

        document.getElementById(
            "review-delivery"
        ).innerText =
        document.getElementById(
            "subscription-delivery"
        ).value;

        document.getElementById(
            "review-phone"
        ).innerText =
        document.getElementById(
            "subscription-phone"
        ).value;

        document.getElementById(
            "review-date"
        ).innerText =
        document.querySelector(
            "[name='start_date']"
        ).value;

        document.getElementById(
            "review-payment"
        ).innerText =
        document.getElementById(
            "subscription-payment"
        ).value;

        const selectedCard =
            document.querySelector(
                ".plan-card.selected"
            );

        if(selectedCard){

            const plan =
                selectedCard.querySelector(
                    "h2"
                ).innerText;

            const price =
                selectedCard.querySelector(
                    "h1"
                ).innerText;

            const items =
                selectedCard.querySelector(
                    "p"
                ).innerText;

            const duration =
                selectedCard.querySelector(
                    "small"
                ).innerText;

            document.getElementById(
                "review-plan"
            ).innerHTML =

            `
            <h3>${plan}</h3>

            <p>${price}</p>

            <p>${items}</p>

            <p>${duration}</p>
            `;

            document.getElementById(
                "subscription-summary"
            ).innerHTML =

            `
            <strong>Plan:</strong> ${plan}<br>

            <strong>Price:</strong> ${price}<br>

            <strong>Items:</strong> ${items}<br>

            <strong>Duration:</strong> ${duration}
            `;

        }

        step2.style.display="none";

        step3.style.display="block";

    }

);

/* Back */

backStep2.addEventListener(

    "click",

    function(){

        step3.style.display="none";

        step2.style.display="block";

    }

);

});
