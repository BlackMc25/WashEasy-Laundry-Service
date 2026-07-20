/*=========================================================
                UPDATE REVIEW PAGE
=========================================================*/

function updateReviewPage(){

    /*=====================================================
                    BOOKING DETAILS
    =====================================================*/

    // Pickup Address
    document.getElementById(
        "review-pickup"
    ).innerText =
        document.getElementById(
            "pickup-address"
        ).value || "Not Provided";


    // Delivery Address
    document.getElementById(
        "review-delivery"
    ).innerText =
        document.getElementById(
            "delivery-address"
        ).value || "Not Provided";


    // Phone Number
    document.getElementById(
        "review-phone"
    ).innerText =
        document.getElementById(
            "phone_number"
        ).value || "Not Provided";


    // Pickup Date
    document.getElementById(
        "review-date"
    ).innerText =
        document.getElementById(
            "pickup_date"
        ).value || "Not Selected";


    // Payment Method
    const payment =
        document.getElementById(
            "payment_method"
        );

    document.getElementById(
        "review-payment"
    ).innerText =
        payment.options[
            payment.selectedIndex
        ].text;


    /*=====================================================
                    LAUNDRY ITEMS
    =====================================================*/

    document.getElementById(
        "review-items"
    ).innerHTML =
        document.getElementById(
            "selected-items"
        ).innerHTML;


    /*=====================================================
                    CHARGES
    =====================================================*/

    document.getElementById(
        "review-charges"
    ).innerHTML =

    `

    <div class="review-charge">

        <span>

            Laundry Cost

        </span>

        <strong>

            ₦${document.getElementById(
                "laundry-cost"
            ).innerText}

        </strong>

    </div>

    <div class="review-charge">

        <span>

            Transport Fee

        </span>

        <strong>

            ${document.getElementById(
                "transport-fee"
            ).innerText}

        </strong>

    </div>

    <div class="review-charge">

        <span>

            Express Fee

        </span>

        <strong>

            ${document.getElementById(
                "express-fee"
            ).innerText}

        </strong>

    </div>

    <hr>

    <div class="review-charge total">

        <span>

            Grand Total

        </span>

        <strong>

            ₦${document.getElementById(
                "total-cost"
            ).innerText}

        </strong>

    </div>

    `;

}