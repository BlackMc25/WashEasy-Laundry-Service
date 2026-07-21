

/*=========================================================
                UPDATE REVIEW PAGE
=========================================================*/

function updateReviewPage(){

    // Pickup Address
    document.getElementById("review-pickup").innerText =
        document.getElementById("pickup-address").value || "Not Provided";

    // Delivery Address
    document.getElementById("review-delivery").innerText =
        document.getElementById("delivery-address").value || "Not Provided";

    // Phone Number
    const phoneInput =
        document.querySelector('input[name="phone_number"]');

    document.getElementById("review-phone").innerText =
        phoneInput ? phoneInput.value : "Not Provided";

    // Pickup Date
    const pickupDate =
        document.getElementById("id_pickup_date");

    document.getElementById("review-date").innerText =
        pickupDate ? pickupDate.value : "Not Selected";

    // Payment Method
    const payment =
        document.getElementById("id_payment_method");

    document.getElementById("review-payment").innerText =
        payment
            ? payment.options[payment.selectedIndex].text
            : "Not Selected";

    // Laundry Items
    document.getElementById("review-items").innerHTML =
        document.getElementById("selected-items").innerHTML;

    // Charges
    document.getElementById("review-charges").innerHTML = `

        <div class="summary-row">
            <span>Laundry Cost</span>
            <strong>₦${document.getElementById("laundry-cost").innerText}</strong>
        </div>

        <div class="summary-row">
            <span>Transport Fee</span>
            <strong>${document.getElementById("transport-fee").innerText}</strong>
        </div>

        <div class="summary-row">
            <span>Express Fee</span>
            <strong>${document.getElementById("express-fee").innerText}</strong>
        </div>

        <hr>

        <div class="summary-total-card">
            <small>Grand Total</small>
            <h3>₦${document.getElementById("total-cost").innerText}</h3>
        </div>

    `;
}