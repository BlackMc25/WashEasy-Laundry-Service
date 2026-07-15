/*=========================================================
                HERO COUNTER
=========================================================*/

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
