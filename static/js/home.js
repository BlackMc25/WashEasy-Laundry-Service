/*=========================================================
                SCROLL TO TOP BUTTON
=========================================================*/
const scrollBtn = document.getElementById("scrollBtn");

if(scrollBtn){

    window.onscroll=function(){

        if(window.scrollY>300){

            scrollBtn.style.display="flex";

        }

        else{

            scrollBtn.style.display="none";

        }

    };

    scrollBtn.addEventListener("click",function(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*=========================================================
                PAGE REFRESH
=========================================================*/

window.addEventListener('pageshow',function(event){

    if(

        event.persisted ||

        window.performance.navigation.type===2

    ){

        window.location.reload();

    }

});

/*=========================================================
                MOBILE REWARD COUNTER
=========================================================*/

const mobileRewardCounter =
document.getElementById("mobileRewardCounter");

if(mobileRewardCounter){

    let mobileRewardValue = 0;

    const mobileRewardTarget = 2568;

    const mobileRewardTimer = setInterval(()=>{

        mobileRewardValue += 24;

        mobileRewardCounter.innerHTML =
        mobileRewardValue + "+";

        if(mobileRewardValue >= mobileRewardTarget){

            mobileRewardCounter.innerHTML =
            "2568+";

            clearInterval(mobileRewardTimer);

        }

    },20);

}

/*=========================================================
                REWARD TEXT SLIDES
=========================================================*/

const rewardSlides =
document.querySelectorAll(".reward-slide");

let rewardIndex = 0;

if(rewardSlides.length){

    setInterval(()=>{

        rewardSlides[rewardIndex]
            .classList.remove("active");

        rewardIndex++;

        if(rewardIndex >= rewardSlides.length){

            rewardIndex = 0;

        }

        rewardSlides[rewardIndex]
            .classList.add("active");

    },4000);

}

const rewardSection =
document.querySelector(".reward-home-content");

if(rewardSection){

    const rewardObserver =
    new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                rewardSection.classList.add("show");

            }

        });

    });

    rewardObserver.observe(rewardSection);

}

const memberSlides =

document.querySelectorAll(".subscription-slide");

let memberIndex = 0;

if(memberSlides.length){

    setInterval(()=>{

    memberSlides[memberIndex]

    .classList.remove("active");

    memberIndex++;

    if(memberIndex >= memberSlides.length){

        memberIndex = 0;

    }

    memberSlides[memberIndex]

    .classList.add("active");

    },4000);

}


const memberCounter =

document.getElementById("memberCounter");

let memberValue = 0;

const memberTarget = 4800;

const memberInterval =

setInterval(()=>{

    memberValue += 40;

    memberCounter.innerHTML = memberValue + "+";

    if(memberValue >= memberTarget){

        memberCounter.innerHTML = "4800+";

        clearInterval(memberInterval);

    }

},20);

const mobileMemberCounter =
document.getElementById("mobileMemberCounter");

if(mobileMemberCounter){

    let mobileMemberValue = 0;

    const mobileMemberTarget = 4800;

    const mobileMemberInterval = setInterval(()=>{

        mobileMemberValue += 40;

        mobileMemberCounter.innerHTML =
        mobileMemberValue + "+";

        if(mobileMemberValue >= mobileMemberTarget){

            mobileMemberCounter.innerHTML =
            "4800+";

            clearInterval(mobileMemberInterval);

        }

    },20);

}

const subscriptionSection =
document.querySelector(".subscription-home-content");

if(subscriptionSection){

    const subscriptionObserver =
    new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                subscriptionSection.classList.add("show");

            }

        });

    });

    subscriptionObserver.observe(subscriptionSection);

}

const expressSlides =
document.querySelectorAll(".express-slide");

let expressIndex = 0;

if(expressSlides.length){

    setInterval(()=>{

        expressSlides[expressIndex]
        .classList.remove("active");

        expressIndex++;

        if(expressIndex >= expressSlides.length){

            expressIndex = 0;

        }

        expressSlides[expressIndex]
        .classList.add("active");

    },3500);

}

const expressCounter =
document.getElementById("expressCounter");

let expressValue = 0;

const expressTarget = 1500;

const expressInterval =
setInterval(()=>{

    expressValue += 15;

    expressCounter.innerHTML =
    expressValue + "+";

    if(expressValue >= expressTarget){

        expressCounter.innerHTML =
        "1500+";

        clearInterval(expressInterval);

    }

},20);

const expressSection =
document.querySelector(".express-card");

if(expressSection){

    const expressObserver =
    new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                expressSection.classList.add("show");

            }

        });

    });

    expressObserver.observe(expressSection);

}

const mobileSlides =
document.querySelectorAll(".mobile-slide");

let mobileIndex = 0;

if(mobileSlides.length){

    setInterval(()=>{

        mobileSlides[mobileIndex]
            .classList.remove("active");

        mobileIndex++;

        if(mobileIndex >= mobileSlides.length){

            mobileIndex = 0;

        }

        mobileSlides[mobileIndex]
            .classList.add("active");

    },3500);

}

const rewardCounter =
document.getElementById("rewardCounter");

if(rewardCounter){

    let rewardValue = 0;

    const rewardTarget = 2568;

    const rewardTimer = setInterval(()=>{

        rewardValue += 24;

        rewardCounter.innerHTML = rewardValue + "+";

        if(rewardValue >= rewardTarget){

            rewardCounter.innerHTML = "2568+";

            clearInterval(rewardTimer);

        }

    },20);

}

