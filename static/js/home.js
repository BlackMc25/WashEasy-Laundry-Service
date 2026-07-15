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

