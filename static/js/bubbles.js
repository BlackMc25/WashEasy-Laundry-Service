/*=========================================================
                FLOATING BACKGROUND BUBBLES
=========================================================*/

document.addEventListener("DOMContentLoaded", function () {

   

    /*---------------------------------------
        Background Floating Bubbles
    ---------------------------------------*/

    const bubblesContainer = document.querySelector(".bubbles");

    if (bubblesContainer) {

        for (let i = 0; i < 20; i++) {

            const bubble = document.createElement("span");

            bubble.className = "bubble";

            bubble.style.left = Math.random() * 100 + "%";

            bubble.style.animationDelay = Math.random() * 6 + "s";

            bubble.style.animationDuration = (5 + Math.random() * 6) + "s";

            bubble.style.width = (8 + Math.random() * 18) + "px";

            bubble.style.height = bubble.style.width;

            bubblesContainer.appendChild(bubble);

        }

    }

    /*---------------------------------------
        Clickable Glass Bubbles
    ---------------------------------------*/

    const bubbles = document.querySelectorAll(".glass-circle, .modal-bubble");

   

    const popup = document.getElementById("bubblePopup");
    const popupCard = document.getElementById("popupCard");
    const popupIcon = document.getElementById("popupIcon");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const actions = document.getElementById("popupActions");
   
 
    if (!popup) return;

        bubbles.forEach(function(bubble){

            bubble.addEventListener("click", function () {

            const icon =
                this.querySelector(".bubble-icon")?.textContent.trim()
                || this.textContent.trim();

            const title = this.dataset.title;

            const message = this.dataset.message;

                        // Reward-specific data
            const bubbleType = this.dataset.type;

            const rewardUrl = this.dataset.url;

            const myRewardUrl = this.dataset.myRewardsUrl;

            const spins = this.dataset.spins;

           const isWeekendReward =
            this.classList.contains("reward-bubble");

            /*=========================================
                    MY REWARDS BUBBLE
            =========================================*/

            const isMyRewardsBubble =
                this.classList.contains("my-rewards-bubble");
            
            const isPromotionBubble =
                this.classList.contains("promotion-bubble");

            const isNewsBubble =
                this.classList.contains("news-bubble");

            const isSettingsBubble =
                this.classList.contains("settings-bubble");
            
            const hasRewards =
                String(this.dataset.hasRewards || "").toLowerCase() === "true";

            console.log("data-has-rewards =", this.dataset.hasRewards);
            console.log("hasRewards =", hasRewards);
            
            const settingsUrl = this.dataset.settingsUrl;

            const winners = this.dataset.winners;

            const endTime = this.dataset.end;

           if (popupCard){

                    popupCard.classList.remove("reward-popup");

                        if (isWeekendReward){

                            popupCard.classList.add("reward-popup");

                        }
                        
                }

            popupIcon.textContent = icon;

            popupTitle.textContent = title;

            popupMessage.textContent = message;

            actions.innerHTML = "";

           if (isWeekendReward) {

            actions.innerHTML = `

                <hr>

                <div class="reward-summary">

                    <div class="reward-item">

                        <span>🎯</span>

                        <div>

                            <strong>${spins}</strong>

                            <small>Spins Remaining</small>

                        </div>

                    </div>

                    <div class="reward-item">

                        <span>🏆</span>

                        <div>

                            <strong>${winners}</strong>

                            <small>Winners Left</small>

                        </div>

                    </div>

                    <div class="reward-item">

                        <span>⏰</span>

                        <div>

                            <strong>${endTime}</strong>

                            <small>Campaign Ends</small>

                        </div>

                    </div>

                </div>

                <a
                    href="${rewardUrl}"
                    class="reward-start-btn">

                    🎡 Spin the Wheel

                </a>

            `;

            }

            /*==========================================
                    MY REWARDS
            ==========================================*/

            else if (isMyRewardsBubble) {

                actions.innerHTML = `

                    <hr>

                    <div class="reward-summary">

                        <div class="reward-item">

                            <span>🎁</span>

                            <div>

                                <strong>Reward Centre</strong>

                                <small>

                                    View your Active Rewards,
                                    Used Rewards and
                                    Expired Rewards.

                                </small>

                            </div>

                        </div>

                    </div>

                    ${hasRewards ? `
                        <a
                            href="${myRewardUrl}"
                            class="reward-start-btn">

                            🎁 Open My Rewards

                        </a>
                    ` : `
                        <button
                            class="reward-start-btn disabled-btn"
                            disabled>

                            🔒 No Rewards Available

                        </button>
                    `}
                `;

            }


            else if (isPromotionBubble){

                actions.innerHTML = `
                
                    

                   <div class="popup-header">

                        🟢 Active Promotions

                    </div>

                    <hr>

                    <div class="popup-feature">

                        <div class="popup-feature-icon">

                            🎁

                        </div>

                        <div>

                            <strong>5 FREE Laundry Items</strong>

                            <small>

                                Redeem selected laundry items completely FREE.

                            </small>

                        </div>

                    </div>

                   <div class="popup-feature">

                       <div class="popup-feature-icon">

                            🚚

                        </div>

                        <div>

                            <strong>FREE Transport Trips</strong>

                            <small>

                                Enjoy free pickup & delivery on eligible bookings.

                            </small>

                        </div>

                    </div>

                    <div class="popup-feature">

                        <div class="popup-feature-icon">

                            🎡

                        </div>

                        <div>

                            <strong>Weekend Reward Spin</strong>

                            <small>

                                Spin every weekend and win exciting laundry rewards.

                            </small>

                        </div>

                    </div>

                   <div class="popup-footer-note">

                        ✨ More exciting rewards coming soon!

                    </div>

                `;

            }

            else if (isNewsBubble){

                actions.innerHTML = `

                    <div class="popup-badge warning">

                        🟠 Coming Soon

                    </div>

                    <hr>

                   <div class="popup-feature">

                       <div class="popup-feature-icon">

                            📢

                        </div>

                        <div>

                            <strong>Announcements Centre</strong>

                            <small>

                                Soon you'll receive service updates,
                                exclusive promotions,
                                reward campaigns and important notifications.

                            </small>

                        </div>

                    </div>

                    <div class="popup-footer-note">

                        🚀 Stay tuned for exciting updates!

                    </div>

                `;

            }

            else if (isSettingsBubble){

                actions.innerHTML = `

                    <div class="popup-badge info">

                        🔵 Account Management

                    </div>

                    <hr>

                   <div class="popup-feature">

                       <div class="popup-feature-icon">

                            👤

                        </div>

                        <div>

                            <strong>Profile</strong>

                            <small>

                                Update your personal information.

                            </small>

                        </div>

                    </div>

                    <div class="popup-feature">

                        <div class="popup-feature-icon">

                            📍

                        </div>

                        <div>

                            <strong>Saved Addresses</strong>

                            <small>

                                Manage pickup & delivery locations.

                            </small>

                        </div>

                    </div>

                   <div class="popup-feature">

                      <div class="popup-feature-icon">

                            🎨

                        </div>

                        <div>

                            <strong>Dashboard Theme</strong>

                            <small>

                                Personalize your WashEasy dashboard.

                            </small>

                        </div>

                    </div>

                 <a
                    href="${settingsUrl}"
                    class="reward-start-btn">

                    ⚙️ Open Settings

                </a>

                `;

            }

            const rect = this.getBoundingClientRect();

            for(let i=0;i<14;i++){

                const particle=document.createElement("span");

                particle.className="burst-particle";

                particle.style.left=(rect.left+rect.width/2)+"px";

                particle.style.top=(rect.top+rect.height/2)+"px";

                particle.style.setProperty(
                    "--x",
                    (Math.random()*180-90)+"px"
                );

                particle.style.setProperty(
                    "--y",
                    (Math.random()*180-90)+"px"
                );

                document.body.appendChild(particle);

                particle.addEventListener("animationend",()=>{

                    particle.remove();

                });

            }

           popup.style.transformOrigin =
           rect.left + rect.width/2 + "px " +
           (rect.top + rect.height/2) + "px";

            popup.classList.add("show");

            this.classList.add("bubble-pop");

            setTimeout(() => {

                this.classList.remove("bubble-pop");

            }, 450);

        });

    });
    /*---------------------------------------
        Close Popup
    ---------------------------------------*/

    popup.addEventListener("click", function (e) {

        if (e.target === popup) {

            popup.classList.remove("show");

        }

    });

});