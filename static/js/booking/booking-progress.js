/*=========================================================
                WASHEASY BOOKING WIZARD
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*=====================================================
                    ELEMENTS
    =====================================================*/

    const pages = {

        step1: document.getElementById("step1-page"),
        step2: document.getElementById("step2-page"),
        step3: document.getElementById("step3-page")

    };

    const progress = [

        document.getElementById("step-1"),
        document.getElementById("step-2"),
        document.getElementById("step-3")

    ];

    const nextBooking =
        document.getElementById("next-to-booking");

    const nextReview =
        document.getElementById("next-to-review");

    const backItems =
        document.getElementById("back-to-items");

    const backBooking =
        document.getElementById("back-to-booking");

    let currentStep = 1;

    /*=====================================================
                    PAGE CONTROL
    =====================================================*/

    function hideAllPages(){

        Object.values(pages).forEach(page=>{

            page.classList.remove("active");

        });

    }

    function resetProgress(){

        progress.forEach(step=>{

            step.classList.remove(
                "progress-active",
                "progress-complete"
            );

        });

    }

    function showStep(step){

        currentStep = step;

        hideAllPages();

        resetProgress();

        switch(step){

            case 1:

                pages.step1.classList.add("active");

                progress[0].classList.add(
                    "progress-active"
                );

                break;

            case 2:

                pages.step2.classList.add("active");

                progress[0].classList.add(
                    "progress-complete"
                );

                progress[1].classList.add(
                    "progress-active"
                );

                break;

            case 3:

                pages.step3.classList.add("active");

                progress[0].classList.add(
                    "progress-complete"
                );

                progress[1].classList.add(
                    "progress-complete"
                );

                progress[2].classList.add(
                    "progress-active"
                );

                break;

        }

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    /*=====================================================
                    VALIDATION
    =====================================================*/

    function validateItems(){

        const quantities =
            document.querySelectorAll(".qty2-value2");

        for(const qty of quantities){

            if(parseInt(qty.value)>0){

                return true;

            }

        }

        alert("Please select at least one laundry item.");

        return false;

    }

    function validateBooking(){

        const phone =
            document.querySelector(
                'input[name="phone_number"]'
            );

        const pickup =
            document.getElementById(
                "id_pickup_date"
            );

        if(phone.value.trim()===""){

            alert("Please enter your phone number.");

            phone.focus();

            return false;

        }

        if(pickup.value===""){

            alert("Please select a pickup date.");

            pickup.focus();

            return false;

        }

        return true;

    }

    /*=====================================================
                    BUTTONS
    =====================================================*/

    if(nextBooking){

        nextBooking.addEventListener("click",()=>{

            if(validateItems()){

                showStep(2);

                document.dispatchEvent(
                new Event("bookingStepVisible")
            );

            }

        });

    }

    if(backItems){

        backItems.addEventListener("click",()=>{

            showStep(1);

        });

    }

    if(nextReview){

    nextReview.addEventListener("click",()=>{

            if(validateBooking()){

                /* ==========================
                    REVIEW DETAILS
                ========================== */

                document.getElementById("review-pickup").textContent =
                    document.getElementById("pickup-address").value || "Not provided";

                document.getElementById("review-delivery").textContent =
                    document.getElementById("delivery-address").value || "Not provided";

                document.getElementById("review-phone").textContent =
                    document.querySelector('input[name="phone_number"]').value || "Not provided";

                document.getElementById("review-date").textContent =
                    document.getElementById("id_pickup_date").value || "Not selected";

                const payment =
                    document.getElementById("id_payment_method");

                document.getElementById("review-payment").textContent =
                    payment.options[payment.selectedIndex].text;

                showStep(3);

            }

        });

    }
    if(backBooking){

        backBooking.addEventListener("click",()=>{

            showStep(2);

        });

    }

    /*=====================================================
                CLICKABLE PROGRESS
    =====================================================*/

    progress[0].addEventListener("click",()=>{

        showStep(1);

    });

    progress[1].addEventListener("click",()=>{

        if(validateItems()){

            showStep(2);

        }

    });

    progress[2].addEventListener("click",()=>{

        if(

            validateItems() &&

            validateBooking()

        ){

            showStep(3);

        }

    });

    /*=====================================================
                    START
    =====================================================*/

    showStep(1);

});