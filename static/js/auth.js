

document.addEventListener("DOMContentLoaded", function () {

/*=========================================================
                LOGIN PASSWORD TOGGLE
=========================================================*/

document
.getElementById("toggleLoginPassword")
.addEventListener(
    "click",
    function(){

        const password=document.getElementById("loginPassword");

        const icon=this.querySelector("i");

        if(password.type==="password"){

            password.type="text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        }

        else{

            password.type="password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");

        }

    }
);


/*=========================================================
            AUTO OPEN LOGIN MODAL
=========================================================*/

document.addEventListener(

'DOMContentLoaded',

function(){

new bootstrap.Modal(

document.getElementById('loginModal')

).show();

}

);

/*=========================================================
            PASSWORD STRENGTH CHECK
=========================================================*/

const password=document.getElementById("password1");

const confirmPassword=document.getElementById("password2");

const strength=document.getElementById("passwordStrength");

const match=document.getElementById("passwordMatch");

function updateRequirement(id,passed){

const item=document.getElementById(id);

if(passed){

item.innerHTML="✅ "+item.innerHTML.substring(2);

item.classList.remove("text-danger");

item.classList.add("text-success");

}

else{

item.innerHTML="❌ "+item.innerHTML.substring(2);

item.classList.remove("text-success");

item.classList.add("text-danger");

}

}

password.addEventListener("input",function(){

const value=password.value;

const checks={

length:value.length>=8,

uppercase:/[A-Z]/.test(value),

lowercase:/[a-z]/.test(value),

number:/[0-9]/.test(value),

special:/[^A-Za-z0-9]/.test(value)

};

let score=0;

for(const key in checks){

updateRequirement(key,checks[key]);

if(checks[key]){

score++;

}

}

if(score<=2){

strength.innerHTML="🔴 Weak";

strength.className="text-danger";

}

else if(score==3){

strength.innerHTML="🟠 Medium";

strength.className="text-warning";

}

else if(score==4){

strength.innerHTML="🟡 Good";

strength.className="text-info";

}

else{

strength.innerHTML="🟢 Strong";

strength.className="text-success";

}

});

confirmPassword.addEventListener("input",function(){

if(confirmPassword.value==password.value){

match.innerHTML="✅ Passwords match";

match.className="text-success";

}

else{

match.innerHTML= "❌ Passwords do not match";

match.className="text-danger";

}

});


/*=========================================================
                SIGNUP PASSWORD TOGGLE
=========================================================*/

function togglePassword(inputId,buttonId){

const input=document.getElementById(inputId);

const icon=document.querySelector("#"+buttonId+" i");

if(input.type==="password"){

input.type="text";

icon.className="bi bi-eye-slash";

}

else{

input.type="password";

icon.className="bi bi-eye";

}

}

document.getElementById("togglePassword1").addEventListener("click",function(){

togglePassword("password1","togglePassword1");

});

document.getElementById("togglePassword2").addEventListener("click",function(){

togglePassword("password2","togglePassword2");

});

});



/*=========================================================
            LOGIN / SIGNUP MODAL BACKGROUND BLUR
=========================================================*/

// Login Modal
const loginModalElement = document.getElementById("loginModal");

loginModalElement.addEventListener("show.bs.modal", function () {

    document
        .getElementById("pageContent")
        .classList.add("page-blur");

});

loginModalElement.addEventListener("hidden.bs.modal", function () {

    document
        .getElementById("pageContent")
        .classList.remove("page-blur");


        AOS.refresh();

});


// Signup Modal
const signupModalElement = document.getElementById("signupModal");

signupModalElement.addEventListener("show.bs.modal", function () {

    document
        .getElementById("pageContent")
        .classList.add("page-blur");

});

signupModalElement.addEventListener("hidden.bs.modal", function () {

    document
        .getElementById("pageContent")
        .classList.remove("page-blur");

        AOS.refresh();
});


/*=========================================================
        LOGIN  →  SIGNUP
=========================================================*/

document
.getElementById("openSignupFromLogin")
.addEventListener("click", function(e){

    e.preventDefault();

    const loginModalElement =
        document.getElementById("loginModal");

    const signupModalElement =
        document.getElementById("signupModal");

    const loginModal =
        bootstrap.Modal.getInstance(loginModalElement);

    loginModalElement.addEventListener(
        "hidden.bs.modal",
        function(){

            // Remove Bootstrap leftovers
            document.body.classList.remove("modal-open");
            document.body.style.removeProperty("padding-right");

            document
                .querySelectorAll(".modal-backdrop")
                .forEach(backdrop => backdrop.remove());

            // Wait one frame before opening Signup
            requestAnimationFrame(function(){

                bootstrap
                    .Modal
                    .getOrCreateInstance(signupModalElement)
                    .show();

            });

        },
        { once:true }
    );

    loginModal.hide();

});

/*=========================================================
        SIGNUP  →  LOGIN
=========================================================*/

document
.getElementById("openLoginFromSignup")
.addEventListener("click", function(e){

    e.preventDefault();

    const signupModalElement =
        document.getElementById("signupModal");

    const loginModalElement =
        document.getElementById("loginModal");

    const signupModal =
        bootstrap.Modal.getInstance(signupModalElement);

    signupModalElement.addEventListener(
        "hidden.bs.modal",
        function(){

            document.body.classList.remove("modal-open");
            document.body.style.removeProperty("padding-right");

            document
                .querySelectorAll(".modal-backdrop")
                .forEach(backdrop => backdrop.remove());

            requestAnimationFrame(function(){

                bootstrap
                    .Modal
                    .getOrCreateInstance(loginModalElement)
                    .show();

            });

        },
        { once:true }
    );

    signupModal.hide();

});

/*=========================================================
            CLEANUP AFTER MODALS CLOSE
=========================================================*/

["loginModal","signupModal"].forEach(function(id){

    const modal = document.getElementById(id);

    modal.addEventListener("hidden.bs.modal", function(){

        // Remove Bootstrap leftovers
        document.body.classList.remove("modal-open");

        document.body.style.removeProperty("padding-right");

        document
        .querySelectorAll(".modal-backdrop")
        .forEach(backdrop => backdrop.remove());

        // Remove page blur
        document
        .getElementById("pageContent")
        .classList.remove("page-blur");

    });

});

