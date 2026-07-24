/*=========================================================
                BUTTON SELECTORS
=========================================================*/

// Standard Laundry Buttons
const plusButtons =
    document.querySelectorAll('.plus-btn2');

const minusButtons =
    document.querySelectorAll('.minus-btn2');


// Express Service Buttons
const expressPlusButtons =
    document.querySelectorAll(".plus-express-btn");

const expressMinusButtons =
    document.querySelectorAll(".minus-express-btn");


/*=========================================================
                UPDATE GRAND TOTAL
=========================================================*/

function updateGrandTotal(){

    // Laundry Cost
    const laundryCost =
        parseFloat(
            document.getElementById(
                'laundry-cost'
            ).innerText.replace(
                /,/g,
                ''
            )
        ) || 0;


    // Transport Fee
    const transportFee =
        parseFloat(
            document.getElementById(
                'transport-fee'
            )
            .innerText
            .replace('₦','')
            .replace(/,/g,'')
        ) || 0;


    // Express Fee
    const expressFee =
        parseFloat(
            document.getElementById(
                "express-fee"
            )
            .innerText
            .replace("₦","")
            .replace(/,/g,"")
        ) || 0;


    // Grand Total
    document.getElementById(
        'total-cost'
    ).innerText =
        (
            laundryCost +
            expressFee +
            transportFee
        ).toLocaleString();

}


/*=========================================================
                CALCULATE SINGLE LAUNDRY ITEM
=========================================================*/

function calculateLaundryItem(card){

    // Standard Quantity Input
    const standardInput =
        card.querySelector(".qty2-value2");


    // Express Quantity Input
    const expressInput =
        card.querySelector(".express-qty");


    // Express Toggle Switch
    const expressToggle =
        card.querySelector(".express-toggle");


    // Standard Service Price
    const price =
        parseFloat(
            standardInput.dataset.price
        ) || 0;


    // Express Service Price
    const expressPrice =
        parseFloat(
            standardInput.dataset.express
        ) || 0;


    // Standard Quantity
    const standardQty =
        parseInt(
            standardInput.value
        ) || 0;


    // Express Quantity
    let expressQty = 0;

    if(expressToggle && expressToggle.checked){

        expressQty =
            parseInt(
                expressInput.value
            ) || 0;

    }


            /*=========================================
                SUBSCRIPTION CALCULATION
        =========================================*/

        const useSubscription =

            document.getElementById("use_subscription") &&

            document.getElementById("use_subscription").value === "true";

        let covered = false;

        console.log("================================");

        console.log("Subscription:", useSubscription);

        console.log("Plan:", window.subscriptionPlan);

        console.log("Basic:", standardInput.dataset.basic);

        console.log("Standard:", standardInput.dataset.standard);

        console.log("Premium:", standardInput.dataset.premium);

        if(useSubscription){

            if(

                window.subscriptionPlan === "Basic" &&

                standardInput.dataset.basic === "true"

            ){

                covered = true;

            }

            else if(

                window.subscriptionPlan === "Standard" &&

                standardInput.dataset.standard === "true"

            ){

                covered = true;

            }

            else if(

                window.subscriptionPlan === "Premium" &&

                standardInput.dataset.premium === "true"

            ){

                covered = true;

            }

        }

        const standardSubtotal =

            covered ?

            0 :

            standardQty * price;

        const expressSubtotal =

            covered ?

            0 :

            expressQty * price;


    // Return Item Information
        return{

        item:
            standardInput.dataset.item,

        service:
            standardInput.dataset.service,

        standardQty,

        expressQty,

        standardSubtotal,

        expressSubtotal,

        expressFee:

            covered ?

            0 :

            expressQty * expressPrice,

        covered

    };

}

/*=========================================================
                UPDATE ORDER SUMMARY
=========================================================*/

function updateSummary(){

    // Total Laundry Cost
    let laundryCost = 0;

    // Total Express Service Fee
    let expressFee = 0;

    // Selected Items HTML
    let selectedItemsHTML = "";


    // Loop Through All Laundry Items
    document
        .querySelectorAll(".item-row")
        .forEach(card => {

            const result =
                calculateLaundryItem(card);


            // Skip Item If No Quantity Is Selected
            if(
                result.standardQty === 0 &&
                result.expressQty === 0
            ){
                return;
            }


            // Calculate Laundry Cost
            laundryCost +=
                result.standardSubtotal +
                result.expressSubtotal;


            // Calculate Express Fee
            expressFee +=
                result.expressFee;


            // Build Selected Items Summary
            selectedItemsHTML += `

            <div class="summary-item">

                <div>

                    <strong>

                        ${result.item}

                    </strong>

                    <br>

                    ${
                        result.covered ?

                        `<span
                            style="
                                color:#198754;
                                font-size:13px;
                                font-weight:bold;
                            ">

                            ✔ Covered by Subscription

                        </span>`

                        :

                        ""

}
                    <br>

                    <small>

                        ${result.service}

                    </small>

                    <br>

                    ${
                        result.standardQty > 0 ?

                        `<small>

                        Standard:
                        ${result.standardQty}
                        × ₦${(
                            result.standardSubtotal /
                            result.standardQty
                        ).toLocaleString()}

                        =

                        ₦${result.standardSubtotal.toLocaleString()}

                        </small><br>`

                        :

                        ""

                    }

                    ${
                        result.expressQty > 0 ?

                        `<small style="color:#0d6efd;">

                        ⚡ Express:
                        ${result.expressQty}
                        × ₦${result.expressFee / result.expressQty}

                        =

                        ₦${result.expressFee.toLocaleString()}

                        </small>`

                        :

                        ""

                    }

                </div>

                <strong>

                    ₦${(
                        result.standardSubtotal +
                        result.expressSubtotal
                    ).toLocaleString()}

                </strong>

            </div>

            `;

        });


    // Display Empty Message If No Item Is Selected
    if(selectedItemsHTML === ""){

        selectedItemsHTML =

        `<p class="text-muted">

            No items selected

        </p>`;

    }


    // Update Selected Items
    document.getElementById(
        "selected-items"
    ).innerHTML =
        selectedItemsHTML;


    // Update Laundry Cost
    document.getElementById(
        "laundry-cost"
    ).innerText =
        laundryCost.toLocaleString();

    const coveredItems =

    document.querySelectorAll(

        ".summary-covered"

    ).length;


    // Update Express Fee
    document.getElementById(
        "express-fee"
    ).innerText =
        "₦" +
        expressFee.toLocaleString();


    // Update Grand Total
    updateGrandTotal();

}

/*=========================================================
                STANDARD QUANTITY - INCREASE
=========================================================*/

plusButtons.forEach(button => {

    button.addEventListener(
        'click',
        function(){

            const qtyInput =
                this.parentElement.querySelector(
                    '.qty2-value2'
                );

            qtyInput.value =
                parseInt(qtyInput.value || 0) + 1;

            // Refresh Order Summary
            updateSummary();

        }
    );

});


/*=========================================================
                EXPRESS QUANTITY - INCREASE
=========================================================*/

expressPlusButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const qtyInput =
                this.parentElement.querySelector(
                    ".express-qty"
                );

            qtyInput.value =
                parseInt(
                    qtyInput.value || 0
                ) + 1;

            // Refresh Order Summary
            updateSummary();

        }
    );

});


/*=========================================================
                STANDARD QUANTITY - DECREASE
=========================================================*/

minusButtons.forEach(button => {

    button.addEventListener(
        'click',
        function(){

            const qtyInput =
                this.parentElement.querySelector(
                    '.qty2-value2'
                );

            let value =
                parseInt(qtyInput.value || 0);

            if(value > 0){

                qtyInput.value =
                    value - 1;

            }

            // Refresh Order Summary
            updateSummary();

        }
    );

});


/*=========================================================
                EXPRESS QUANTITY - DECREASE
=========================================================*/

expressMinusButtons.forEach(button => {

    button.addEventListener(
        "click",
        function(){

            const qtyInput =
                this.parentElement.querySelector(
                    ".express-qty"
                );

            let value =
                parseInt(
                    qtyInput.value || 0
                );

            if(value > 0){

                qtyInput.value =
                    value - 1;

            }

            // Refresh Order Summary
            updateSummary();

        }
    );

});


/*=========================================================
                EXPRESS SERVICE TOGGLE
=========================================================*/

document
    .querySelectorAll(".express-toggle")
    .forEach(toggle => {

        toggle.addEventListener(
            "change",
            function(){

                const id =
                    this.dataset.id;

                const section =
                    document.getElementById(
                        "expressQty" + id
                    );

                const expressInput =
                    section.querySelector(
                        ".express-qty"
                    );

                // Show Express Quantity
                if(this.checked){

                    section.style.display =
                        "block";

                }
                // Hide Express Quantity
                else{

                    section.style.display =
                        "none";

                    expressInput.value = 0;

                }

                // Refresh Order Summary
                updateSummary();

            }
        );

    });


/*=========================================================
                INITIALIZE SUMMARY
=========================================================*/

// Load Summary When Page Opens
updateSummary();

const subscriptionToggle =
document.getElementById(
    "useSubscription"
);

if(subscriptionToggle){

    subscriptionToggle.addEventListener(
        "change",

        function(){

            document.getElementById(
                "use_subscription"
            ).value =

            this.checked ?

            "true"

            :

            "false";

            updateSummary();

        }

    );

}