/*=========================================================
                BUTTON SELECTORS
=========================================================*/

// Standard Laundry Buttons
const plusButtons =
    document.querySelectorAll(".plus-btn2");

const minusButtons =
    document.querySelectorAll(".minus-btn2");


// Express Buttons
const expressPlusButtons =
    document.querySelectorAll(".plus-express-btn");

const expressMinusButtons =
    document.querySelectorAll(".minus-express-btn");


// Subscription Toggle
const subscriptionToggle =
    document.getElementById("useSubscription");


/*=========================================================
                STANDARD QUANTITY +
=========================================================*/

plusButtons.forEach(button => {

    button.addEventListener("click", function () {

        const qtyInput =
            this.parentElement.querySelector(".qty2-value2");

        qtyInput.value =
            parseInt(qtyInput.value || 0) + 1;

        refreshPricing();

    });

});


/*=========================================================
                STANDARD QUANTITY -
=========================================================*/

minusButtons.forEach(button => {

    button.addEventListener("click", function () {

        const qtyInput =
            this.parentElement.querySelector(".qty2-value2");

        let value =
            parseInt(qtyInput.value || 0);

        if(value > 0){

            qtyInput.value =
                value - 1;

        }

        refreshPricing();

    });

});


/*=========================================================
                EXPRESS QUANTITY +
=========================================================*/

expressPlusButtons.forEach(button => {

    button.addEventListener("click", function () {

        const qtyInput =
            this.parentElement.querySelector(".express-qty");

        qtyInput.value =
            parseInt(qtyInput.value || 0) + 1;

        refreshPricing();

    });

});


/*=========================================================
                EXPRESS QUANTITY -
=========================================================*/

expressMinusButtons.forEach(button => {

    button.addEventListener("click", function () {

        const qtyInput =
            this.parentElement.querySelector(".express-qty");

        let value =
            parseInt(qtyInput.value || 0);

        if(value > 0){

            qtyInput.value =
                value - 1;

        }

        refreshPricing();

    });

});


/*=========================================================
                EXPRESS TOGGLE
=========================================================*/

document
    .querySelectorAll(".express-toggle")
    .forEach(toggle => {

        toggle.addEventListener("change", function () {

            const id =
                this.dataset.id;

            const section =
                document.getElementById(
                    "expressQty" + id
                );

            const expressInput =
                section.querySelector(".express-qty");

            if(this.checked){

                section.style.display = "block";

            }

            else{

                section.style.display = "none";

                expressInput.value = 0;

            }

            refreshPricing();

        });

    });


/*=========================================================
                SUBSCRIPTION TOGGLE
=========================================================*/

if(subscriptionToggle){

    subscriptionToggle.addEventListener("change", function(){

        document.getElementById(
            "use_subscription"
        ).value =

        this.checked ?

        "true"

        :

        "false";

        refreshPricing();

    });

}


/*=========================================================
                INITIALIZE
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function(){

        refreshPricing();

    }

);