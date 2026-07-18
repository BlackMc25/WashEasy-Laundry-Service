/*=========================================================
                BOOKING PROGRESS
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");

    const bookingSection =
        document.getElementById("booking-details-section");

    const reviewSection =
        document.getElementById("review-section");

    function showSection(section){

        if(!section) return;

        section.classList.remove("booking-hidden");
        section.classList.add("booking-visible");

    }

    function hideSection(section){

        if(!section) return;

        section.classList.remove("booking-visible");
        section.classList.add("booking-hidden");

    }

    function completeStep(step){

        step.classList.remove("progress-active");
        step.classList.add("progress-complete");

    }

    function activateStep(step){

        step.classList.add("progress-active");

    }

    function resetStep(step){

        step.classList.remove(
            "progress-active",
            "progress-complete"
        );

    }

    function hasLaundryItems(){

        const quantities =
            document.querySelectorAll(".qty2-value2");

        let selected = false;

        quantities.forEach(input=>{

            if(parseInt(input.value) > 0){

                selected = true;

            }

        });

        return selected;

    }

    function bookingDetailsCompleted(){

        const phone =
            document.querySelector(
                'input[name="phone_number"]'
            );

        const pickup =
            document.getElementById("id_pickup_date");

        if(!phone || !pickup){

            return false;

        }

        return (

            phone.value.trim() !== "" &&

            pickup.value.trim() !== ""

        );

    }

    function updateProgress(){

        // STEP 1

        if(hasLaundryItems()){

            completeStep(step1);

            activateStep(step2);

            showSection(bookingSection);

        }else{

            activateStep(step1);

            resetStep(step2);
            resetStep(step3);

            hideSection(bookingSection);
            hideSection(reviewSection);

            return;

        }

        // STEP 2

        if(bookingDetailsCompleted()){

            completeStep(step2);

            activateStep(step3);

            showSection(reviewSection);

        }else{

            resetStep(step3);

            hideSection(reviewSection);

        }

    }

    // Watch quantity buttons

    document.querySelectorAll(
        ".plus-btn2,.minus-btn2,.plus-express-btn,.minus-express-btn"
    ).forEach(button=>{

        button.addEventListener("click",function(){

            setTimeout(updateProgress,100);

        });

    });

    // Watch phone

    const phone =
        document.querySelector(
            'input[name="phone_number"]'
        );

    if(phone){

        phone.addEventListener(
            "input",
            updateProgress
        );

    }

    // Watch pickup date

    const pickupDate =
        document.getElementById("id_pickup_date");

    if(pickupDate){

        pickupDate.addEventListener(
            "change",
            updateProgress
        );

    }

    // Initial state

    updateProgress();

});