

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

    /*==========================================================
                PROGRESS BAR
==========================================================*/

const progressStep1 =
    document.getElementById(
        "progress-step-1"
    );

const progressStep2 =
    document.getElementById(
        "progress-step-2"
    );

const progressStep3 =
    document.getElementById(
        "progress-step-3"
    );

const progressStep4 =
    document.getElementById(
        "progress-step-4"
    );

const progressLine1 =
    document.getElementById(
        "progress-line-1"
    );

const progressLine2 =
    document.getElementById(
        "progress-line-2"
    );

const progressLine3 =
    document.getElementById(
        "progress-line-3"
    );

/* Step 1 -> Step 2 */

nextButton.addEventListener(
    "click",
    function(){

        if(selectedPlanInput.value === ""){

            alert("Please select a subscription plan before continuing.");

            return;

        }

        step1.style.display = "none";

        step2.style.display = "block";

        updateProgress(2);

    }
);

function updateProgress(step){

    const steps = [

        progressStep1,

        progressStep2,

        progressStep3,

        progressStep4

    ];

    const lines = [

        progressLine1,

        progressLine2,

        progressLine3

    ];

    steps.forEach(s =>

        s.classList.remove(
            "active"
        )

    );

    lines.forEach(l =>

        l.classList.remove(
            "active"
        )

    );

    for(let i = 0; i < step; i++){

        steps[i].classList.add(
            "active"
        );

    }

    for(let i = 0; i < step - 1; i++){

        lines[i].classList.add(
            "active"
        );

    }

}
/* Step 2 -> Step 1 */

backButton.addEventListener(
    "click",
    function(){

        step2.style.display="none";

        step1.style.display="block";

        updateProgress(1);

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

        const pickup =
            document.getElementById(
                "subscription-pickup"
            );

        const delivery =
            document.getElementById(
                "subscription-delivery"
            );

        const phone =
            document.getElementById(
                "subscription-phone"
            );

        const pickupDate =
            document.querySelector(
                "[name='start_date']"
            );

        const payment =
            document.getElementById(
                "subscription-payment"
            );

        if(
            pickup.value.trim() === "" ||
            delivery.value.trim() === "" ||
            phone.value.trim() === "" ||
            pickupDate.value.trim() === "" ||
            payment.value.trim() === ""
        ){

            alert(
                "Please complete all required fields."
            );

            return;

        }

        /* REVIEW */

        document.getElementById(
            "review-pickup"
        ).innerText = pickup.value;

        document.getElementById(
            "review-delivery"
        ).innerText = delivery.value;

        document.getElementById(
            "review-phone"
        ).innerText = phone.value;

        document.getElementById(
            "review-date"
        ).innerText = pickupDate.value;

        document.getElementById(
            "review-payment"
        ).innerText = payment.value;

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
            ).innerHTML = `
                <h3>${plan}</h3>
                <p>${price}</p>
                <p>${items}</p>
                <p>${duration}</p>
            `;

            document.getElementById(
                "subscription-summary"
            ).innerHTML = `
                <strong>Plan:</strong> ${plan}<br>
                <strong>Price:</strong> ${price}<br>
                <strong>Items:</strong> ${items}<br>
                <strong>Duration:</strong> ${duration}
            `;
        }

        step2.style.display = "none";

        step3.style.display = "block";


    }

);

/* Back */

backStep2.addEventListener(

    "click",

    function(){

        step3.style.display="none";

        step2.style.display="block";

        updateProgress(3);

    }

);

});
