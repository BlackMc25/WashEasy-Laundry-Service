/*=========================================================
                    WashEasy Home JavaScript
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Home.js Loaded");

    initBubblePopup();
    initNavbarScroll();
    initScrollTopButton();
    createFloatingBubbles();
    initLoginPasswordToggle();
    initCounterAnimation();
    initSignupValidation();
    initThemeToggle();
    initModalSwitching();
    initAOS();

});


/*=========================================================
                    Bubble Popup
=========================================================*/

function initBubblePopup(){

    console.log("Bubble JS Loaded");

    const bubbles = document.querySelectorAll(".glass-circle, .modal-bubble");

    console.log("Bubbles Found:", bubbles.length);

    bubbles.forEach(bubble => {

        // Temporary Debug Border
        bubble.style.border = "3px solid red";

        bubble.addEventListener("click", () => {

            alert("Bubble Clicked!");

        });

    });

}


/*=========================================================
                    Navbar Scroll Effect
=========================================================*/

function initNavbarScroll(){

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if(window.scrollY > 80){

            navbar.classList.add("scrolled");

        }else{

            navbar.classList.remove("scrolled");

        }

    });

}


/*=========================================================
                    Scroll To Top Button
=========================================================*/

function initScrollTopButton(){

    const scrollBtn = document.getElementById("scrollBtn");

    if(!scrollBtn) return;

    window.addEventListener("scroll", () => {

        scrollBtn.style.display =
            window.scrollY > 300 ? "flex" : "none";

    });

    scrollBtn.addEventListener("click", () => {

        window.scrollTo({

            top:0,
            behavior:"smooth"

        });

    });

}


/*=========================================================
                Floating Background Bubbles
=========================================================*/

function createFloatingBubbles(){

    const container = document.querySelector(".bubbles");

    if(!container) return;

    for(let i=0;i<20;i++){

        const bubble = document.createElement("span");

        bubble.className="bubble";

        bubble.style.left=Math.random()*100+"%";

        bubble.style.animationDelay=Math.random()*6+"s";

        bubble.style.animationDuration=(5+Math.random()*6)+"s";

        bubble.style.width=(8+Math.random()*18)+"px";

        bubble.style.height=bubble.style.width;

        container.appendChild(bubble);

    }

}


/*=========================================================
                Login Password Toggle
=========================================================*/

function initLoginPasswordToggle(){

    const btn = document.getElementById("toggleLoginPassword");

    if(!btn) return;

    btn.addEventListener("click",function(){

        const password=document.getElementById("loginPassword");

        const icon=this.querySelector("i");

        if(password.type==="password"){

            password.type="text";

            icon.classList.replace("fa-eye","fa-eye-slash");

        }else{

            password.type="password";

            icon.classList.replace("fa-eye-slash","fa-eye");

        }

    });

}


/*=========================================================
                Page Show Refresh
=========================================================*/

window.addEventListener("pageshow",function(event){

    if(event.persisted || performance.navigation.type===2){

        window.location.reload();

    }

});


/*=========================================================
                Counter Animation
=========================================================*/

function initCounterAnimation(){

    document.querySelectorAll(".counter").forEach(counter=>{

        function update(){

            const target=+counter.dataset.target;

            const current=+counter.innerText;

            const increment=Math.ceil(target/60);

            if(current<target){

                counter.innerText=current+increment;

                setTimeout(update,25);

            }else{

                counter.innerText=target.toLocaleString()+"+";

            }

        }

        update();

    });

}


/*=========================================================
                Signup Validation
=========================================================*/

function initSignupValidation(){

    const password=document.getElementById("password1");

    const confirmPassword=document.getElementById("password2");

    const strength=document.getElementById("passwordStrength");

    const match=document.getElementById("passwordMatch");

    if(!password || !confirmPassword) return;

    password.addEventListener("input",function(){

        const value=password.value;

        const checks={

            length:value.length>=8,

            uppercase:/[A-Z]/.test(value),

            lowercase:/[a-z]/.test(value),

            number:/[0-9]/.test(value),

            special:/[^A-Za-z0-9]/.test(value)

        };

        updateRequirement("length",checks.length);

        updateRequirement("uppercase",checks.uppercase);

        updateRequirement("lowercase",checks.lowercase);

        updateRequirement("number",checks.number);

        updateRequirement("special",checks.special);

        const score=Object.values(checks).filter(Boolean).length;

        if(score<=2){

            strength.innerHTML="🔴 Weak";

            strength.className="text-danger";

        }else if(score===3){

            strength.innerHTML="🟠 Medium";

            strength.className="text-warning";

        }else if(score===4){

            strength.innerHTML="🟡 Good";

            strength.className="text-info";

        }else{

            strength.innerHTML="🟢 Strong";

            strength.className="text-success";

        }

    });

    confirmPassword.addEventListener("input",()=>{

        if(confirmPassword.value===password.value){

            match.innerHTML="✅ Passwords match";

            match.className="text-success";

        }else{

            match.innerHTML="❌ Passwords do not match";

            match.className="text-danger";

        }

    });

}


/*=========================================================
            Password Requirement Helper
=========================================================*/

function updateRequirement(id,passed){

    const item=document.getElementById(id);

    if(!item) return;

    item.innerHTML=(passed?"✅ ":"❌ ")+item.innerHTML.substring(2);

    item.classList.toggle("text-success",passed);

    item.classList.toggle("text-danger",!passed);

}


/*=========================================================
                Password Eye Toggle
=========================================================*/

function togglePassword(inputId,buttonId){

    const input=document.getElementById(inputId);

    const icon=document.querySelector(`#${buttonId} i`);

    if(input.type==="password"){

        input.type="text";

        icon.className="fas fa-eye-slash";

    }else{

        input.type="password";

        icon.className="fas fa-eye";

    }

}

document.getElementById("togglePassword1")?.addEventListener("click",()=>{

    togglePassword("password1","togglePassword1");

});

document.getElementById("togglePassword2")?.addEventListener("click",()=>{

    togglePassword("password2","togglePassword2");

});


/*=========================================================
                    Dark / Light Mode
=========================================================*/

function initThemeToggle(){

    const desktopBtn=document.getElementById("themeToggleDesktop");

    const mobileBtn=document.getElementById("themeToggleMobile");

    function updateIcons(theme){

        const icon=theme==="dark"
            ?"bi bi-sun-fill"
            :"bi bi-moon-stars-fill";

        desktopBtn?.querySelector("i").className=icon;

        mobileBtn?.querySelector("i").className=icon;

    }

    function setTheme(theme){

        document.body.classList.remove("light","dark");

        document.body.classList.add(theme);

        localStorage.setItem("theme",theme);

        updateIcons(theme);

    }

    setTheme(localStorage.getItem("theme") || "light");

    function toggleTheme(){

        setTheme(

            document.body.classList.contains("dark")
            ?"light"
            :"dark"

        );

    }

    desktopBtn?.addEventListener("click",toggleTheme);

    mobileBtn?.addEventListener("click",toggleTheme);

}


/*=========================================================
                Login / Signup Modal Switch
=========================================================*/

function initModalSwitching(){

    document.getElementById("openSignupFromLogin")?.addEventListener("click",function(e){

        e.preventDefault();

        bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();

        setTimeout(()=>{

            new bootstrap.Modal(document.getElementById("signupModal")).show();

        },300);

    });

    document.getElementById("openLoginFromSignup")?.addEventListener("click",function(e){

        e.preventDefault();

        bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();

        setTimeout(()=>{

            new bootstrap.Modal(document.getElementById("loginModal")).show();

        },300);

    });

}


/*=========================================================
                    AOS Animation
=========================================================*/

function initAOS(){

    AOS.init({

        duration:1000,

        once:true,

        easing:"ease-in-out"

    });

}