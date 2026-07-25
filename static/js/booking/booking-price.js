/*=========================================================
                BOOKING PRICING ENGINE
=========================================================*/

/*
|--------------------------------------------------------------------------
| Refresh Entire Booking
|--------------------------------------------------------------------------
*/

function refreshPricing() {

    const pricing = getPricingData();

    updateSummary(pricing);

    updateReview(pricing);

}


/*
|--------------------------------------------------------------------------
| Main Pricing Object
|--------------------------------------------------------------------------
*/


/*=========================================================
                GET ALL PRICING DATA
=========================================================*/

function getPricingData(){

    const selectedItems =
        getSelectedItems();

    let coveredItems = 0;

    let chargedItems = 0;

    selectedItems.forEach(item=>{

        item.covered =
            isCoveredBySubscription(item);

        if(item.covered){

            coveredItems++;

        }

        else{

            chargedItems++;

        }

    });

    /*
    ------------------------------------
    Laundry
    ------------------------------------
    */

    const laundry =
        calculateLaundryTotal(
            selectedItems
        );

    /*
    ------------------------------------
    Pricing Object
    ------------------------------------
    */

    const pricing = {

        laundryTotal:
            laundry.laundryTotal,

        expressFee:
            laundry.expressFee,

        transportFee:0,

        grandTotal:0,

        selectedItems,

        coveredItems,

        chargedItems,

        subscriptionUsed:
            isSubscriptionEnabled(),

        subscriptionPlan:
            getSubscriptionPlan(),

        totalDistance:
            getTotalDistance()

    };

    /*
    ------------------------------------
    Transport
    ------------------------------------
    */

    pricing.transportFee =
        calculateTransportFee(
            pricing
        );

    /*
    ------------------------------------
    Grand Total
    ------------------------------------
    */

    pricing.grandTotal =

        pricing.laundryTotal +

        pricing.expressFee +

        pricing.transportFee;

    return pricing;

}

/*=========================================================
            CALCULATE LAUNDRY TOTAL
=========================================================*/

function calculateLaundryTotal(selectedItems){

    let laundryTotal = 0;

    let expressFee = 0;

    selectedItems.forEach(item=>{

        /*
        ------------------------------------
        STANDARD
        ------------------------------------
        */

        if(item.covered){

            item.standardTotal = 0;

        }

        else{

            item.standardTotal =

                item.quantity *

                item.price;

        }

        /*
        ------------------------------------
        EXPRESS
        ------------------------------------
        */

        item.expressTotal =

            item.expressQuantity *

            item.price;

        item.expressFee =

            item.expressQuantity *

            item.expressPrice;

        /*
        ------------------------------------
        LINE TOTAL
        ------------------------------------
        */

        item.lineTotal =

            item.standardTotal +

            item.expressTotal +

            item.expressFee;

        /*
        ------------------------------------
        GRAND LAUNDRY TOTAL
        ------------------------------------
        */

        laundryTotal +=

            item.standardTotal +

            item.expressTotal;

        expressFee +=

            item.expressFee;

    });

    return{

        laundryTotal,

        expressFee

    };

}
/*
|--------------------------------------------------------------------------
| Subscription Toggle
|--------------------------------------------------------------------------
*/

function isSubscriptionEnabled() {

    const toggle =
        document.getElementById("useSubscription");

    return toggle
        ? toggle.checked
        : false;

}


/*
|--------------------------------------------------------------------------
| Subscription Plan
|--------------------------------------------------------------------------
*/

function getSubscriptionPlan() {

    return window.subscriptionPlan || null;

}


/*
|--------------------------------------------------------------------------
| Total Distance
|--------------------------------------------------------------------------
*/

function getTotalDistance() {

    return parseFloat(

        document.getElementById(
            "id_total_distance_km"
        )?.value

    ) || 0;

}


/*
|--------------------------------------------------------------------------
| Update Booking Summary
|--------------------------------------------------------------------------
*/


/*=========================================================
                UPDATE SUMMARY
=========================================================*/

function updateSummary(pricing){

    /*
    ------------------------------------
    Selected Items
    ------------------------------------
    */

    const selectedItemsContainer =
        document.getElementById(
            "selected-items"
        );

    selectedItemsContainer.innerHTML = "";

    if(pricing.selectedItems.length === 0){

        selectedItemsContainer.innerHTML =

        `
        <p class="text-muted">

            No items selected

        </p>
        `;

    }

    else{

        pricing.selectedItems.forEach(item=>{

            let badge = "";

            if(item.covered){

                badge =

                `<span class="badge bg-success">

                    FREE

                </span>`;

            }

            selectedItemsContainer.innerHTML +=

            `
            <div class="summary-item">

                <div>

                    <strong>

                        ${item.item}

                    </strong>

                    <br>

                    <small>

                        ${item.service}

                    </small>

                </div>

                <div class="text-end">

                    <div>

                        x${item.quantity}

                    </div>

                    ${badge}

                </div>

            </div>

            <hr>
            `;

        });

    }

    /*
    ------------------------------------
    Laundry Cost
    ------------------------------------
    */

    document.getElementById(
        "laundry-cost"
    ).innerText =

    pricing.laundryTotal.toLocaleString();

    /*
    ------------------------------------
    Transport
    ------------------------------------
    */

    document.getElementById(
        "transport-fee"
    ).innerText =

    "₦" +

    pricing.transportFee.toLocaleString();

    /*
    ------------------------------------
    Express
    ------------------------------------
    */

    document.getElementById(
        "express-fee"
    ).innerText =

    "₦" +

    pricing.expressFee.toLocaleString();

    /*
    ------------------------------------
    Grand Total
    ------------------------------------
    */

    document.getElementById(
        "total-cost"
    ).innerText =

    pricing.grandTotal.toLocaleString();

}
/*
|--------------------------------------------------------------------------
| Update Review Page
|--------------------------------------------------------------------------
*/

/*=========================================================
                UPDATE REVIEW
=========================================================*/

function updateReview(pricing){

    const reviewItems =

        document.getElementById(
            "review-items"
        );

    if(!reviewItems){

        return;

    }

    reviewItems.innerHTML = "";

    pricing.selectedItems.forEach(item=>{

        let text =

        item.covered ?

        "FREE"

        :

        "₦" +

        item.lineTotal.toLocaleString();

        reviewItems.innerHTML +=

        `
        <div class="review-item d-flex justify-content-between">

            <div>

                ${item.item}

                (${item.service})

            </div>

            <strong>

                ${text}

            </strong>

        </div>

        `;

    });

    document.getElementById(
        "review-charges"
    ).innerHTML =

    `
    <p>

        Laundry :

        ₦${pricing.laundryTotal.toLocaleString()}

    </p>

    <p>

        Express :

        ₦${pricing.expressFee.toLocaleString()}

    </p>

    <p>

        Transport :

        ₦${pricing.transportFee.toLocaleString()}

    </p>

    <hr>

    <h5>

        Total :

        ₦${pricing.grandTotal.toLocaleString()}

    </h5>
    `;

}
/*=========================================================
                GET ALL SELECTED ITEMS
=========================================================*/

function getSelectedItems(){

    const items = [];

    document.querySelectorAll(".laundry-card").forEach(card => {

        const standardInput =
            card.querySelector(".qty2-value2");

        const expressInput =
            card.querySelector(".express-qty");

        const expressToggle =
            card.querySelector(".express-toggle");

        const quantity =
            parseInt(
                standardInput?.value || 0
            );

        const expressQuantity =
            parseInt(
                expressInput?.value || 0
            );

        if(
            quantity === 0 &&
            expressQuantity === 0
        ){
            return;
        }

        items.push({

            id:
                standardInput.dataset.id,

            item:
                standardInput.dataset.item,

            category:
                standardInput.dataset.category,

            service:
                standardInput.dataset.service,

            price:
                parseFloat(
                    standardInput.dataset.price
                ),

            expressPrice:
                parseFloat(
                    standardInput.dataset.expressPrice
                ),

            quantity,

            expressQuantity,

            expressEnabled:
                expressToggle
                ? expressToggle.checked
                : false,

            basic:
                standardInput.dataset.basic === "true",

            standard:
                standardInput.dataset.standard === "true",

            premium:
                standardInput.dataset.premium === "true"

        });

    });

    return items;

}

/*=========================================================
                GET ALL SELECTED ITEMS
=========================================================*/

function getSelectedItems(){

    const items = [];

    document.querySelectorAll(".qty2-value2").forEach(input => {

        const quantity =
            parseInt(input.value) || 0;

        const expressInput =
            document.querySelector(

                `input[name="express_${input.name}"]`

            );

        const expressQuantity =
            expressInput
            ? parseInt(expressInput.value) || 0
            : 0;

        if(
            quantity === 0 &&
            expressQuantity === 0
        ){
            return;
        }

        items.push({

            item:
                input.dataset.item,

            service:
                input.dataset.service,

            price:
                parseFloat(input.dataset.price),

            expressPrice:
                parseFloat(input.dataset.express),

            quantity,

            expressQuantity,

            basic:
                input.dataset.basic === "true",

            standard:
                input.dataset.standard === "true",

            premium:
                input.dataset.premium === "true"

        });

    });

    return items;

}

/*=========================================================
            CHECK SUBSCRIPTION COVERAGE
=========================================================*/

function isCoveredBySubscription(item){

    // Customer is not using subscription
    if(!isSubscriptionEnabled()){

        return false;

    }

    // No active subscription
    const plan =
        getSubscriptionPlan();

    if(!plan){

        return false;

    }

    switch(plan.toLowerCase()){

        case "basic":

            return item.basic;

        case "standard":

            return item.standard;

        case "premium":

            return item.premium;

        default:

            return false;

    }

}

/*=========================================================
            CALCULATE TRANSPORT FEE
=========================================================*/

function calculateTransportFee(pricing){

    const PRICE_PER_KM =
        window.WashEasyConfig.PRICE_PER_KM || 0;

    const FREE_TRIPS =
        window.WashEasyConfig.FREE_TRANSPORT_TRIPS || 0;

    /*
    ------------------------------------
    Free Transport Available
    ------------------------------------
    */

    if(

        pricing.subscriptionUsed &&

        FREE_TRIPS > 0

    ){

        return 0;

    }

    /*
    ------------------------------------
    Normal Transport
    ------------------------------------
    */

    return pricing.totalDistance * PRICE_PER_KM;

}

document.addEventListener(

    "DOMContentLoaded",

    function(){

        console.log(

            getPricingData()

        );

    }

);