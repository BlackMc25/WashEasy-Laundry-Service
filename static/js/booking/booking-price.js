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

    const totals =
        calculateLaundryTotal(selectedItems);

    return{

        laundryTotal:
            totals.laundryTotal,

        expressFee:
            totals.expressFee,

        transportFee:0,

        grandTotal:
            totals.laundryTotal +
            totals.expressFee,

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

/*=========================================================
                UPDATE SUMMARY
=========================================================*/

function updateSummary(pricing){

    console.clear();

    console.log("========== BOOKING ==========");

    pricing.selectedItems.forEach(item=>{

        console.table({

            Item:item.item,

            Qty:item.quantity,

            Express:item.expressQuantity,

            Covered:item.covered,

            Standard:item.standardTotal,

            ExpressLaundry:item.expressTotal,

            ExpressFee:item.expressFee,

            LineTotal:item.lineTotal

        });

    });

    console.log(

        "Laundry:",

        pricing.laundryTotal

    );

    console.log(

        "Express:",

        pricing.expressFee

    );

    console.log(

        "Grand:",

        pricing.grandTotal

    );

}

/*
|--------------------------------------------------------------------------
| Update Review Page
|--------------------------------------------------------------------------
*/

function updateReview(pricing) {

    console.log(
        "Review Updated:",
        pricing
    );

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

document.addEventListener(

    "DOMContentLoaded",

    function(){

        console.log(

            getPricingData()

        );

    }

);