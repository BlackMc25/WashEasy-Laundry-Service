/*=========================================================
                BOOKING PRICING ENGINE
=========================================================*/

/*
|--------------------------------------------------------------------------
| Refresh Entire Booking
|--------------------------------------------------------------------------
*/

async function refreshPricing(){

    let pricing = getPricingData();

    if(getBenefitType() === "REWARD"){

        const rewardResult = await validateReward(
            pricing.selectedItems
        );

        pricing.rewardPlan = rewardResult.plan;

        if (rewardResult.valid) {

            /*
            ==========================================
            FREE TRANSPORT REWARD
            ==========================================
            */

            if (rewardResult.transport_fee !== undefined) {

                pricing.transportFee = rewardResult.transport_fee;

                pricing.grandTotal =
                    pricing.laundryTotal +
                    pricing.transportFee +
                    pricing.expressFee;
            }

            /*
            ==========================================
            REWARD SUBSCRIPTION / LAUNDRY REWARD
            ==========================================
            */

            else {

                pricing.laundryTotal = rewardResult.payable_laundry;

                pricing.rewardPlan = rewardResult.plan;

                pricing.coveredItems =
                    rewardResult.covered_items || 0;

                pricing.chargedItems =
                    rewardResult.paid_items || 0;

                pricing.remainingSubscription =
                    rewardResult.remaining_after_booking || 0;

                pricing.selectedItems.forEach(item => {

                    const allocation = rewardResult.items.find(

                        x => x.price_list_id === item.price_list_id

                    );

                    if(!allocation){

                        item.rewardQuantity = 0;

                        item.rewardPaidQuantity = item.quantity;

                        return;

                    }

                    /*
                    Reward Subscription
                    */

                    if (

                        rewardResult.plan === "subscription_standard" ||

                        rewardResult.plan === "subscription_premium"

                    ) {

                        item.coveredQuantity =
                            allocation.covered_quantity;

                        item.paidQuantity =
                            allocation.paid_quantity;

                    }

                    /*
                    Laundry Reward
                    */

                    else {

                        item.rewardQuantity =
                            allocation.reward_quantity;

                        item.rewardPaidQuantity =
                            allocation.paid_quantity;

                    }

                });

                pricing.grandTotal =
                    pricing.laundryTotal +
                    pricing.transportFee +
                    pricing.expressFee;

            }

}

    }

        /*
    ------------------------------------
    Subscription Validation
    ------------------------------------
    */

    if(getBenefitType() === "SUBSCRIPTION"){

        const subscriptionResult = await validateSubscription(

            pricing.selectedItems

        );

        if(subscriptionResult.valid){

            pricing.laundryTotal =

                subscriptionResult.payable_laundry;

            pricing.coveredItems =

                subscriptionResult.covered_items;

            pricing.chargedItems =

                subscriptionResult.paid_items;

            pricing.remainingSubscription =

                subscriptionResult.remaining_after_booking;

                 /*
                ------------------------------------
                Attach per-item subscription result
                ------------------------------------
                */

                pricing.selectedItems.forEach(item => {

                    const allocation = subscriptionResult.items.find(

                        x => x.price_list_id === item.price_list_id

                    );

                    if(allocation){

                        item.coveredQuantity = allocation.covered_quantity;

                        item.paidQuantity = allocation.paid_quantity;

                    }

                    else{

                        item.coveredQuantity = 0;

                        item.paidQuantity = item.quantity;

                    }

                });

            pricing.grandTotal =

                pricing.laundryTotal +

                pricing.transportFee +

                pricing.expressFee;

        }

    }

    updateSummary(pricing);

    updateReview(pricing);

}

async function validateSubscription(selectedItems){

    const response = await fetch(

        "/api/subscriptions/validate-booking/",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "X-CSRFToken": getCSRFToken()

            },

            body: JSON.stringify({

                items: selectedItems

            })

        }

    );

    return await response.json();

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

            coveredItems += item.quantity;

        }
        else{

            chargedItems += item.quantity;

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

        document
        .getElementById("clearAllAddresses")
        .addEventListener("click", function(){

            /*
            ==========================
            Addresses
            ==========================
            */

            document.getElementById(
                "pickup-address"
            ).value = "";

            document.getElementById(
                "delivery-address"
            ).value = "";

            /*
            ==========================
            Coordinates
            ==========================
            */

            document.getElementById(
                "id_pickup_latitude"
            ).value = "";

            document.getElementById(
                "id_pickup_longitude"
            ).value = "";

            document.getElementById(
                "id_delivery_latitude"
            ).value = "";

            document.getElementById(
                "id_delivery_longitude"
            ).value = "";

            /*
            ==========================
            Distances
            ==========================
            */

            document.getElementById(
                "pickup-distance"
            ).innerText = "0 km";

            document.getElementById(
                "delivery-distance"
            ).innerText = "0 km";

            document.getElementById(
                "total-distance"
            ).innerText = "0 km";

            document.getElementById(
                "summary-pickup-distance"
            ).innerText = "0 km";

            document.getElementById(
                "summary-delivery-distance"
            ).innerText = "0 km";

            /*
            ==========================
            Hidden Inputs
            ==========================
            */

            document.getElementById(
                "id_pickup_distance_km"
            ).value = 0;

            document.getElementById(
                "id_delivery_distance_km"
            ).value = 0;

            document.getElementById(
                "id_total_distance_km"
            ).value = 0;

            /*
            ==========================
            Remove Map Objects
            ==========================
            */

            if(pickupMarker){

                map.removeLayer(
                    pickupMarker
                );

                pickupMarker = null;

            }

            if(deliveryMarker){

                map.removeLayer(
                    deliveryMarker
                );

                deliveryMarker = null;

            }

            if(pickupRoute){

                map.removeLayer(
                    pickupRoute
                );

                pickupRoute = null;

            }

            if(deliveryRoute){

                map.removeLayer(
                    deliveryRoute
                );

                deliveryRoute = null;

            }

            refreshPricing();

        });

/*
|--------------------------------------------------------------------------
| Subscription Toggle
|--------------------------------------------------------------------------
*/

function getBenefitType() {

    const benefitType = document.getElementById("benefitType");

    if (!benefitType) {
        return "";
    }

    return benefitType.value || "";
}


function isSubscriptionEnabled(){

    return getBenefitType() ===

        "SUBSCRIPTION";

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
        document.getElementById("selected-items");

    if (!selectedItemsContainer) {
        return;
    }

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

        pricing.selectedItems.forEach(item => {

            const benefitType = getBenefitType();

            const rewardType =
                document.getElementById(
                    "rewardType"
                )?.value;

            const isRewardSubscription =
                benefitType === "REWARD" && (
                    pricing.rewardPlan === "subscription_standard" ||
                    pricing.rewardPlan === "subscription_premium"
                );

            /*
            ==========================================
            SUBSCRIPTION OR REWARD SUBSCRIPTION
            ==========================================
            */

            if(
                benefitType === "SUBSCRIPTION" ||
                isRewardSubscription
            ){

                const coveredLabel =
                    isRewardSubscription
                        ? "👑 Covered by Reward Subscription"
                        : "👑 Covered by Subscription";

                if(item.coveredQuantity > 0){

                    selectedItemsContainer.innerHTML += `
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
                                    x${item.coveredQuantity}
                                </div>

                                <span class="subscription-free">
                                    ${coveredLabel}
                                </span>

                            </div>

                        </div>

                        <hr>
                    `;

                }

                if(item.paidQuantity > 0){

                    const total =
                        item.paidQuantity *
                        item.price;

                    selectedItemsContainer.innerHTML += `
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
                                    x${item.paidQuantity}
                                </div>

                                <span class="text-danger fw-bold">
                                    💳 Additional Laundry
                                </span>

                                <br>

                                <strong>
                                    ₦${total.toLocaleString()}
                                </strong>

                            </div>

                        </div>

                        <hr>
                    `;

                }

            }

            /*
            ==========================================
            LAUNDRY REWARD
            ==========================================
            */

            else if(
                benefitType === "REWARD" &&
                rewardType !== "transport_1" &&
                rewardType !== "transport_3"
            ){

                if(item.rewardQuantity > 0){

                    selectedItemsContainer.innerHTML += `
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
                                    x${item.rewardQuantity}
                                </div>

                                <span class="subscription-free">
                                    🎁 Covered by Reward
                                </span>

                            </div>

                        </div>

                        <hr>
                    `;

                }

                if(item.rewardPaidQuantity > 0){

                    const total =
                        item.rewardPaidQuantity *
                        item.price;

                    selectedItemsContainer.innerHTML += `
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
                                    x${item.rewardPaidQuantity}
                                </div>

                                <span class="text-danger fw-bold">
                                    💳 Additional Laundry
                                </span>

                                <br>

                                <strong>
                                    ₦${total.toLocaleString()}
                                </strong>

                            </div>

                        </div>

                        <hr>
                    `;

                }

            }

            /*
            ==========================================
            TRANSPORT REWARD
            ==========================================
            */

            else if(
                benefitType === "REWARD" &&
                (
                    rewardType === "transport_1" ||
                    rewardType === "transport_3"
                )
            ){

                const total =
                    item.quantity *
                    item.price;

                selectedItemsContainer.innerHTML += `
                    <div class="summary-item">

                        <div>
                            <strong>${item.item}</strong>
                            <br>
                            <small>${item.service}</small>
                        </div>

                        <div class="text-end">

                            <div>
                                x${item.quantity}
                            </div>

                            <strong>
                                ₦${total.toLocaleString()}
                            </strong>

                            <br>

                            <small class="text-success">
                                🚚 Free Transport Applied
                            </small>

                        </div>

                    </div>

                    <hr>
                `;

            }

            /*
            ==========================================
            NORMAL BOOKING
            ==========================================
            */

            else{

                const total =
                    item.quantity *
                    item.price;

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

                        ${
                            item.quantity > 0
                            ? `
                                <div>
                                    Normal: x${item.quantity}
                                </div>
                            `
                            : ""
                        }

                        ${
                            item.expressQuantity > 0
                            ? `
                                <div class="text-warning fw-bold">
                                    Express: x${item.expressQuantity}
                                </div>
                            `
                            : ""
                        }

                        ${badge}

                    </div>

                </div>

                <hr>
                `;

            }

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

    "₦" +

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

async function updateReviewPage(){

    // all your address, phone, payment code...

    await refreshPricing();
}

function updateReview(pricing){

    const reviewItems =

        document.getElementById(
            "review-items"
        );

    if(!reviewItems){

        return;

    }

    reviewItems.innerHTML = "";

   pricing.selectedItems.forEach(item => {

    const benefitType = getBenefitType();

    const isRewardSubscription =

    benefitType === "REWARD" && (

        pricing.rewardPlan === "subscription_standard" ||

        pricing.rewardPlan === "subscription_premium"

    );

    /*
    ==========================================
    SUBSCRIPTION REVIEW
    ==========================================
    */

    if( benefitType === "SUBSCRIPTION" || isRewardSubscription){

        if(item.coveredQuantity > 0){

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-success">

                        ${isRewardSubscription
                    ? "👑 Covered by Reward Subscription"
                    : "👑 Covered by Subscription"} ×${item.coveredQuantity}

                    </small>

                </div>

                <strong class="text-success">

                    FREE

                </strong>

            </div>

            `;

        }

        if(item.paidQuantity > 0){

            const amount = item.paidQuantity * item.price;

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-danger">

                        💳 Additional Laundry ×${item.paidQuantity}

                    </small>

                </div>

                <strong class="text-danger">

                    ₦${amount.toLocaleString()}

                </strong>

            </div>

            `;

        }

    }

    /*
    ==========================================
    REWARD REVIEW
    ==========================================
    */

    else if(
    benefitType === "REWARD" &&
    !isRewardSubscription){

    const rewardType = document.getElementById(
        "rewardType"
    )?.value;

    /*
    ==========================================
    TRANSPORT REWARD
    ==========================================
    */

    if (

        rewardType === "transport_1" ||

        rewardType === "transport_3"

    ) {

        const amount = item.quantity * item.price;

        reviewItems.innerHTML += `

        <div class="review-item d-flex justify-content-between align-items-center mb-2">

            <div>

                ${item.item}

                (${item.service})

                <br>

                <small class="text-success fw-bold">

                    🚚 Free Transport Applied

                </small>

            </div>

            <strong>

                ₦${amount.toLocaleString()}

            </strong>

        </div>

        `;

        return;



    }

    /*
    ==========================================
    REWARD SUBSCRIPTION
    ==========================================
    */

    if(

        rewardType === "subscription_standard" ||

        rewardType === "subscription_premium"

    ){

        if(item.coveredQuantity > 0){

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-success fw-bold">

                        👑 Covered by Reward Subscription ×${item.coveredQuantity}

                    </small>

                </div>

                <strong class="text-success">

                    FREE

                </strong>

            </div>

            `;

        }

        if(item.paidQuantity > 0){

            const amount = item.paidQuantity * item.price;

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-danger fw-bold">

                        💳 Additional Laundry ×${item.paidQuantity}

                    </small>

                </div>

                <strong class="text-danger">

                    ₦${amount.toLocaleString()}

                </strong>

            </div>

            `;

        }

    }

    /*
    ==========================================
    LAUNDRY REWARD
    ==========================================
    */

    else{

        if(item.rewardQuantity > 0){

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-warning fw-bold">

                        🎁 Covered by Reward ×${item.rewardQuantity}

                    </small>

                </div>

                <strong class="text-success">

                    FREE

                </strong>

            </div>

            `;

        }

        if(item.rewardPaidQuantity > 0){

            const amount = item.rewardPaidQuantity * item.price;

            reviewItems.innerHTML += `

            <div class="review-item d-flex justify-content-between align-items-center mb-2">

                <div>

                    ${item.item}

                    (${item.service})

                    <br>

                    <small class="text-danger fw-bold">

                        💳 Additional Laundry ×${item.rewardPaidQuantity}

                    </small>

                </div>

                <strong class="text-danger">

                    ₦${amount.toLocaleString()}

                </strong>

            </div>

            `;

        }

    }

}
    /*
    ==========================================
    NORMAL BOOKING
    ==========================================
    */

    else{

        const amount = item.quantity * item.price;

        reviewItems.innerHTML += `

        <div class="review-item d-flex justify-content-between align-items-center mb-2">

            <div>

                ${item.item}

                (${item.service})

            </div>

            <strong>

                ₦${amount.toLocaleString()}

            </strong>

        </div>

        `;

    }

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

    document.querySelectorAll(".qty2-value2").forEach(input => {

        const quantity =
            parseInt(input.value) || 0;


        /*
        ------------------------------------
        Find Express Quantity
        ------------------------------------
        */

        const expressInput =
            document.querySelector(
                `input[name="express_${input.name}"]`
            );

        const expressQuantity =
            expressInput
                ? parseInt(expressInput.value) || 0
                : 0;


        /*
        ------------------------------------
        Total Quantity
        ------------------------------------
        */

        const totalQuantity =
            quantity + expressQuantity;


        /*
        ------------------------------------
        Nothing selected
        ------------------------------------
        */

        if(totalQuantity === 0){
            return;
        }


        /*
        ------------------------------------
        Add Item
        ------------------------------------
        */

        items.push({

            price_list_id:
                parseInt(
                    input.dataset.priceListId
                ),

            item:
                input.dataset.item,

            service:
                input.dataset.service,

            price:
                parseFloat(
                    input.dataset.price
                ),

            expressPrice:
                parseFloat(
                    input.dataset.express
                ),

            quantity:

                quantity,

            expressQuantity:

                expressQuantity,

            totalQuantity:

                totalQuantity,

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

function getRewardValidationEndpoint() {

    const rewardType = document.getElementById(
        "rewardType"
    )?.value;

    switch (rewardType) {

        case "transport_1":
        case "transport_3":
            return "/api/rewards/validate-transport/";

        case "subscription_standard":
        case "subscription_premium":
            return "/api/rewards/validate-subscription/";

        case "express":
            return "/api/rewards/validate-express/";

        default:
            return "/api/rewards/validate-booking/";
    }

}

async function validateReward(selectedItems){

    const selectedReward = document.querySelector(
            'input[name="booking_reward"]:checked'
        );


   const response = await fetch(

        getRewardValidationEndpoint(),

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "X-CSRFToken": getCSRFToken()

            },

          

            body: JSON.stringify({

                items: selectedItems,

                reward_id: selectedReward
                    ? selectedReward.value
                    : null

            })

        }

    );

    return await response.json();

}


document.addEventListener("DOMContentLoaded", function () {

    document
    .querySelectorAll(
        'input[name="booking_reward"]'
    )
    .forEach(radio => {

        radio.addEventListener("change", function(){

            document.getElementById("benefitType").value = "REWARD";

            document.getElementById("rewardType").value =
                this.dataset.prizeType;

            refreshPricing();

        });

    });

});


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

document.querySelectorAll(
    'input[name="benefit_choice"]'
).forEach(function(radio){

    radio.addEventListener("change", function(){

        document.getElementById(
            "benefitType"
        ).value = this.value;

        refreshPricing();

    });

});

document.addEventListener(

    "DOMContentLoaded",

);

