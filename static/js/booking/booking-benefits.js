document.addEventListener(

    "DOMContentLoaded",

    function(){

        const hidden =
            document.getElementById(
                "benefitType"
            );

        const radios =
            document.querySelectorAll(
                'input[name="benefit_choice"]'
            );

        radios.forEach(radio=>{

            radio.addEventListener(

                "change",

                function(){

                    const rewardPanel =
                     document.getElementById("bookingRewardPanel");

                    if (rewardPanel){

                        rewardPanel.style.display =
                            this.value === "REWARD"
                                ? "block"
                                : "none";

                    }

                    refreshPricing();

                }

            );

        });

                /* =====================================
           ADD THIS PART HERE
        ====================================== */

        const selectedReward =
            document.querySelector(
                'input[name="booking_reward"]:checked'
            );

        if (selectedReward){

            document.getElementById("rewardType").value =
                selectedReward.dataset.prizeType;

        }

         refreshPricing();

    }

);