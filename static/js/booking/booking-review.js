/*=========================================================
                UPDATE REVIEW PAGE
=========================================================*/

function updateReviewPage(){

    console.log("Updating Review Page...");

    /*=========================
        PICKUP ADDRESS
    =========================*/

    const pickup =
        document.getElementById(
            "pickup-address"
        ).value;

    console.log("Pickup:", pickup);

    document.getElementById(
        "review-pickup"
    ).innerText =
        pickup || "Not Provided";


    /*=========================
        DELIVERY ADDRESS
    =========================*/

    const delivery =
        document.getElementById(
            "delivery-address"
        ).value;

    console.log("Delivery:", delivery);

    document.getElementById(
        "review-delivery"
    ).innerText =
        delivery || "Not Provided";


    /*=========================
        PHONE
    =========================*/

    const phoneInput =
        document.querySelector(
            'input[name="phone_number"]'
        );

    console.log(
        "Phone:",
        phoneInput ? phoneInput.value : null
    );

    document.getElementById(
        "review-phone"
    ).innerText =
        phoneInput
        ? phoneInput.value
        : "Not Provided";


    /*=========================
        PICKUP DATE
    =========================*/

    const pickupDate =
        document.getElementById(
            "id_pickup_date"
        );

    console.log(
        "Pickup Date:",
        pickupDate ? pickupDate.value : null
    );

    document.getElementById(
        "review-date"
    ).innerText =
        pickupDate
        ? pickupDate.value
        : "Not Selected";


    /*=========================
        PAYMENT
    =========================*/

    const payment =
        document.getElementById(
            "id_payment_method"
        );

    console.log(
        "Payment:",
        payment
        ? payment.value
        : null
    );

    document.getElementById(
        "review-payment"
    ).innerText =
        payment
        ? payment.options[
            payment.selectedIndex
        ].text
        : "Not Selected";


    /*=========================
        LAUNDRY ITEMS
    =========================*/

    document.getElementById(
        "review-items"
    ).innerHTML =
        document.getElementById(
            "selected-items"
        ).innerHTML;

        refreshPricing();

}