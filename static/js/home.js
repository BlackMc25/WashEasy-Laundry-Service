

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ Bubble JS Loaded");

    const bubbles = document.querySelectorAll(".glass-circle, .modal-bubble");

    console.log("Bubbles Found:", bubbles.length);

    bubbles.forEach(function(bubble){

        bubble.style.border = "3px solid red";

        bubble.addEventListener("click", function(){

            alert("Bubble Clicked!");

        });

    });

});




    window.addEventListener("scroll",()=>{

    const navbar=document.querySelector(".navbar");

    if(window.scrollY>80){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});



    const scrollBtn = document.getElementById("scrollBtn");

window.onscroll = function(){

    if(window.scrollY > 300){
        scrollBtn.style.display = "flex";
    } else {
        scrollBtn.style.display = "none";
    }

};

scrollBtn.addEventListener("click", function(){

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

});




const bubbles=document.querySelector(".bubbles");

for(let i=0;i<20;i++){

    const bubble=document.createElement("span");

    bubble.className="bubble";

    bubble.style.left=Math.random()*100+"%";

    bubble.style.animationDelay=Math.random()*6+"s";

    bubble.style.animationDuration=5+Math.random()*6+"s";

    bubble.style.width=8+Math.random()*18+"px";

    bubble.style.height=bubble.style.width;

    bubbles.appendChild(bubble);

}




document
.getElementById("toggleLoginPassword")
.addEventListener(
    "click",
    function(){

        const password =
            document.getElementById(
                "loginPassword"
            );

        const icon =
            this.querySelector("i");

        if(password.type === "password"){

            password.type = "text";

            icon.classList.remove(
                "fa-eye"
            );

            icon.classList.add(
                "fa-eye-slash"
            );

        }else{

            password.type = "password";

            icon.classList.remove(
                "fa-eye-slash"
            );

            icon.classList.add(
                "fa-eye"
            );

        }

    }
);

    document.addEventListener(
        'DOMContentLoaded',
        function(){

            new bootstrap.Modal(
                document.getElementById('loginModal')
            ).show();
        }
    );




window.addEventListener('pageshow', function(event) {

    if (
        event.persisted ||
        window.performance.navigation.type === 2
    ) {
        window.location.reload();
    }

});




    document.querySelectorAll(".counter").forEach(counter=>{

const update=()=>{

const target=+counter.dataset.target;

const count=+counter.innerText;

const speed=60;

const inc=Math.ceil(target/speed);

if(count<target){

counter.innerText=count+inc;

setTimeout(update,25);

}

else{

counter.innerText=target.toLocaleString()+"+";

}

}

update();

});



    const password =
    document.getElementById("password1");

const confirmPassword =
    document.getElementById("password2");

const strength =
    document.getElementById("passwordStrength");

const match =
    document.getElementById("passwordMatch");

function updateRequirement(id, passed){

    const item =
        document.getElementById(id);

    if(passed){

        item.innerHTML =
            "✅ " +
            item.innerHTML.substring(2);

        item.classList.remove("text-danger");

        item.classList.add("text-success");

    }else{

        item.innerHTML =
            "❌ " +
            item.innerHTML.substring(2);

        item.classList.remove("text-success");

        item.classList.add("text-danger");

    }

}

password.addEventListener(
    "input",
    function(){

        const value =
            password.value;

        const checks = {

            length:
                value.length >= 8,

            uppercase:
                /[A-Z]/.test(value),

            lowercase:
                /[a-z]/.test(value),

            number:
                /[0-9]/.test(value),

            special:
                /[^A-Za-z0-9]/.test(value)

        };

        let score = 0;

        for(const key in checks){

            updateRequirement(
                key,
                checks[key]
            );

            if(checks[key]){

                score++;

            }

        }

        if(score <= 2){

            strength.innerHTML =
                "🔴 Weak";

            strength.className =
                "text-danger";

        }
        else if(score == 3){

            strength.innerHTML =
                "🟠 Medium";

            strength.className =
                "text-warning";

        }
        else if(score == 4){

            strength.innerHTML =
                "🟡 Good";

            strength.className =
                "text-info";

        }
        else{

            strength.innerHTML =
                "🟢 Strong";

            strength.className =
                "text-success";

        }

    }
);

confirmPassword.addEventListener(
    "input",
    function(){

        if(
            confirmPassword.value ==
            password.value
        ){

            match.innerHTML =
                "✅ Passwords match";

            match.className =
                "text-success";

        }
        else{

            match.innerHTML =
                "❌ Passwords do not match";

            match.className =
                "text-danger";

        }

    }
);


    function togglePassword(
    inputId,
    buttonId
){

    const input =
        document.getElementById(inputId);

    const icon =
        document.querySelector(
            "#" +
            buttonId +
            " i"
        );

    if(input.type === "password"){

        input.type = "text";

        icon.className =
            "fas fa-eye-slash";

    }else{

        input.type = "password";

        icon.className =
            "fas fa-eye";

    }

}

document
.getElementById("togglePassword1")
.addEventListener(
    "click",
    function(){

        togglePassword(
            "password1",
            "togglePassword1"
        );

    }
);

document
.getElementById("togglePassword2")
.addEventListener(
    "click",
    function(){

        togglePassword(
            "password2",
            "togglePassword2"
        );

    }
);



const desktopBtn = document.getElementById("themeToggleDesktop");
const mobileBtn = document.getElementById("themeToggleMobile");

function updateIcons(theme){

    const iconClass =
        theme === "dark"
        ? "bi bi-sun-fill"
        : "bi bi-moon-stars-fill";

    if(desktopBtn){

        desktopBtn.querySelector("i").className = iconClass;

    }

    if(mobileBtn){

        mobileBtn.querySelector("i").className = iconClass;

    }

}

function setTheme(theme){

    document.body.classList.remove("light","dark");

    document.body.classList.add(theme);

    localStorage.setItem("theme",theme);

    updateIcons(theme);

}

const savedTheme =
    localStorage.getItem("theme") || "light";

setTheme(savedTheme);

function toggleTheme(){

    if(document.body.classList.contains("dark")){

        setTheme("light");

    }else{

        setTheme("dark");

    }

}

if(desktopBtn){

    desktopBtn.addEventListener("click",toggleTheme);

}

if(mobileBtn){

    mobileBtn.addEventListener("click",toggleTheme);

}



// don't have an account SignUp
document.getElementById("openSignupFromLogin").addEventListener("click", function(e){

    e.preventDefault();

    // Close Login Modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));

    loginModal.hide();

    // Wait for login modal to close
    setTimeout(function(){

        const signupModal = new bootstrap.Modal(document.getElementById("signupModal"));

        signupModal.show();

    },300);

});

// already have an account 

document.getElementById("openLoginFromSignup").addEventListener("click", function(e){

    e.preventDefault();

    // Close Signup Modal
    const signupModal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));

    signupModal.hide();

    // Open Login Modal
    setTimeout(function(){

        const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));

        loginModal.show();

    },300);

})




AOS.init({

    duration:1000,

    once:true,

    easing:"ease-in-out"

});

