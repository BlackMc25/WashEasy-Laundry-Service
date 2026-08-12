/*=========================================================
                UPDATE REVIEW PAGE
=========================================================*/

async function updateReviewPage(){

    /*=========================
        PICKUP ADDRESS
    =========================*/

    const pickup =
        document.getElementById(
            "pickup-address"
        ).value;

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

await refreshPricing();
}