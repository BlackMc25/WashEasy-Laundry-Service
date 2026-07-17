/*=========================================================
        CUSTOM SCROLL ANIMATION ENGINE
=========================================================*/

const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("animate");

        }

    });

},

{

    threshold:0.18

}

);

document.querySelectorAll("[data-aos]")

.forEach(element=>{

    observer.observe(element);

});