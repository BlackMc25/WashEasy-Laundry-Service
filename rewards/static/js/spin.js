
let prizes = [];

let currentRotation = 0;

let prizeMap = {};

document.addEventListener("DOMContentLoaded", function () {

    const svg = document.getElementById("rewardWheel");

    prizes = JSON.parse(
        document.getElementById("reward-prizes").textContent
    );

    drawWheel(svg, prizes);

    const spinButton = document.getElementById("spinButton");

    if (spinButton) {

        spinButton.addEventListener("click", spinWheel);

    }

});

const SIZE = 600;

const CENTER = SIZE / 2;

const RADIUS = 260;

const COLORS = {

    items: "#2563eb",

    transport: "#16a34a",

    express: "#f59e0b",

    subscription: "#7c3aed",

    try_again: "#9ca3af",

};


function getPrizeColor(type){

    if(type.startsWith("items"))
        return COLORS.items;

    if(type.startsWith("transport"))
        return COLORS.transport;

    if(type.startsWith("subscription"))
        return COLORS.subscription;

    if(type === "express")
        return COLORS.express;

    return COLORS.try_again;

}

const ICONS = {

    items:"👕",

    transport:"🚚",

    express:"⚡",

    subscription:"⭐",

    try_again:"😔"

};

function getPrizeIcon(type){

    if(type.startsWith("items"))
        return "👕";

    if(type.startsWith("transport"))
        return "🚚";

    if(type.startsWith("subscription"))
        return "⭐";

    if(type === "express")
        return "⚡";

    return "🎯";

}

function drawWheel(svg, prizes){

    svg.innerHTML = "";

      prizeMap = {};

    const angle = 360 / prizes.length;

    prizes.forEach(function(prize, index){

        drawSegment(

            svg,

            prize,

            index,

            angle

        );

    });

    drawCenter(svg);

    drawOuterRing(svg);

}

function rotateWheel(stopAngle){

    const wheel = document.getElementById("rewardWheel");

    const extraSpins = 360 * 6;

    currentRotation = currentRotation + extraSpins;

    currentRotation =
        currentRotation -
        (currentRotation % 360);

    currentRotation += stopAngle;

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

}

function drawOuterRing(svg){

    const ring = document.createElementNS(

        "http://www.w3.org/2000/svg",

        "circle"

    );

    ring.setAttribute("cx", CENTER);

    ring.setAttribute("cy", CENTER);

    ring.setAttribute("r", 264);

    ring.setAttribute("fill", "none");

    ring.setAttribute("stroke", "#1d4ed8");

    ring.setAttribute("stroke-width", "10");

    svg.appendChild(ring);

}


function drawSegment(svg, prize, index, angle){

    const startAngle = index * angle;

    const endAngle = startAngle + angle;

    const centerAngle = startAngle + (angle / 2);

    const stopAngle = 360 - centerAngle;

    prizeMap[prize.id] = {

        id: prize.id,

        name: prize.name,

        type: prize.type,

        startAngle,

        endAngle,

        centerAngle,

        stopAngle

    };

    const start = polarToCartesian(
        CENTER,
        CENTER,
        RADIUS,
        endAngle
    );

    const end = polarToCartesian(
        CENTER,
        CENTER,
        RADIUS,
        startAngle
    );

    const largeArc = angle > 180 ? 1 : 0;

    const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );

    path.setAttribute(
        "d",

        `M ${CENTER} ${CENTER}
         L ${start.x} ${start.y}
         A ${RADIUS} ${RADIUS} 0 ${largeArc} 0 ${end.x} ${end.y}
         Z`
    );

    path.setAttribute(
        "fill",

        getPrizeColor(
            prize.type
        )
    );

    path.setAttribute(
        "stroke",

        "#ffffff"
    );

    path.setAttribute(
        "stroke-width",

        "3"
    );

    svg.appendChild(path);

        drawText(

            svg,

            prize,

            startAngle + angle / 2

        );

}


function drawText(svg, prize, angle){

    const point = polarToCartesian(

        CENTER,

        CENTER,

        170,

        angle

    );

    // ------------------------
    // Icon
    // ------------------------

    const icon = document.createElementNS(

        "http://www.w3.org/2000/svg",

        "text"

    );

    icon.setAttribute("x", point.x);

    icon.setAttribute("y", point.y - 22);

    icon.setAttribute("text-anchor", "middle");

    icon.setAttribute("dominant-baseline", "middle");

    icon.setAttribute("font-size", "28");

    icon.textContent = getPrizeIcon(prize.type);

    svg.appendChild(icon);

    // ------------------------
    // Label
    // ------------------------

    const label = document.createElementNS(

        "http://www.w3.org/2000/svg",

        "text"

    );

    label.setAttribute("x", point.x);

    label.setAttribute("y", point.y + 18);

    label.setAttribute("fill", "white");

    label.setAttribute("font-size", "18");

    label.setAttribute("font-weight", "700");

    label.setAttribute("text-anchor", "middle");

    label.setAttribute("dominant-baseline", "middle");

    label.textContent = prize.name;

    svg.appendChild(label);

}


function drawCenter(svg){

    const circle = document.createElementNS(

        "http://www.w3.org/2000/svg",

        "circle"

    );

    circle.setAttribute("cx", CENTER);

    circle.setAttribute("cy", CENTER);

    circle.setAttribute("r", 70);

    circle.setAttribute("fill", "#0f4fff");

    circle.setAttribute("stroke", "#fff");

    circle.setAttribute("stroke-width", "5");

    svg.appendChild(circle);

    const label = document.createElementNS(

        "http://www.w3.org/2000/svg",

        "text"

    );

    label.setAttribute("x", CENTER);

    label.setAttribute("y", CENTER);

    label.setAttribute("fill", "white");

    label.setAttribute("font-size", "24");

    label.setAttribute("font-weight", "700");

    label.setAttribute("text-anchor", "middle");

    label.setAttribute(
        "dominant-baseline",

        "middle"
    );

    label.textContent = "WashEasy";

    svg.appendChild(label);

}

function polarToCartesian(cx, cy, radius, angle){

    const radians = (angle - 90) * Math.PI / 180;

    return {

        x: cx + radius * Math.cos(radians),

        y: cy + radius * Math.sin(radians)

    };

}

async function spinWheel() {

    const button = document.getElementById("spinButton");

    let data = null;

    button.disabled = true;
    button.innerHTML = "🎡 Spinning...";

    try{

        const response = await fetch("/api/rewards/spin/",{

            method:"POST",

            headers:{
                "X-CSRFToken":getCSRFToken(),
                "Content-Type":"application/json"
            }

        });

        data = await response.json();

        document.getElementById("remainingSpins").textContent =
        data.remaining_spins;

        if (data.remaining_spins <= 0){

            button.disabled = true;

            button.innerHTML = "No Spins Left";

        }

        console.log(data);

        const winningPrize = prizeMap[data.prize.id];

        console.log("Winning Prize");

        console.table(winningPrize);

        rotateWheel(

            winningPrize.stopAngle

        );

        setTimeout(function(){

            showSpinResult(data);

            button.disabled = false;

            button.innerHTML = "🎡 Spin Now";

            },10000);

    }

    catch(error){

        console.error(error);

    }

    finally{

        if(!data){

            button.disabled = false;

            button.innerHTML = "🎡 Spin Now";

        }

    }

}

function getCSRFToken(){

    return document.querySelector(
        "[name=csrfmiddlewaretoken]"
    ).value;

}

function showSpinResult(data){

    const modal = document.getElementById("spinResultModal");

    const emoji = document.getElementById("resultEmoji");

    const title = document.getElementById("resultTitle");

    const message = document.getElementById("resultMessage");

    const rewardIcon = document.getElementById("rewardIcon");

    const rewardName = document.getElementById("rewardName");

    const rewardDescription = document.getElementById("rewardDescription");

    const remainingSpinText = document.getElementById("remainingSpinText");


    // -----------------------------
    // TRY AGAIN
    // -----------------------------

    if(data.prize.type === "try_again"){

        emoji.textContent = "😔";

        title.textContent = "Better Luck Next Time!";

        message.textContent =
            "You didn't win a reward this time.";

        rewardIcon.textContent = "🎯";

        rewardName.textContent = "Try Again";

        rewardDescription.textContent =
            "Don't worry, you still have another chance.";

    }

    // -----------------------------
    // WINNER
    // -----------------------------

    else{

        emoji.textContent = "🎉";

        title.textContent = "Congratulations!";

        message.textContent =
            "Your reward has been added to your account.";

        rewardIcon.textContent =
            getPrizeIcon(data.prize.type);

        rewardName.textContent =
            data.prize.name;

        rewardDescription.textContent =
            "Redeem it before it expires.";

    }

    remainingSpinText.textContent =
        data.remaining_spins;

    modal.classList.add("show");

}

document.addEventListener("DOMContentLoaded", function(){

    const closeBtn = document.getElementById("closeResultBtn");

    if(closeBtn){

        closeBtn.addEventListener("click", function(){

            document
                .getElementById("spinResultModal")
                .classList.remove("show");

        });

    }

});