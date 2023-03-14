const field=document.querySelector(".field");
const size=document.querySelector(".size");
const sizeOptions=document.querySelector(".sizeOptions");
const sizeChoice=document.querySelectorAll(".sizeChoice");
const greyFon=document.querySelector(".greyFon");
const newGame=document.querySelector(".newGame");
const numberOfSteps=document.querySelector(".steps");
const time=document.querySelector(".clock");
const win=document.querySelector(".win");
const finalSteps=document.querySelector(".finalSteps");
const finalTime=document.querySelector(".finalTime");
const audio=document.querySelectorAll("audio")[0];
const sounds=document.querySelectorAll("audio")[1];
const musicButton=document.querySelector(".music");
const soundsButton=document.querySelector(".sounds");
const results=document.querySelector(".results");
const resultsDiv=document.querySelector(".resultsDiv");
const resultsFon=document.querySelector(".statistics");
const sendform=document.querySelector(".sendForm");
const username=document.getElementById("user");



let x0, y0;
let sampleArray=[ [[],[],[]] , [[],[],[],[]] , [[],[],[],[],[]] , [[],[],[],[],[],[]] , [[],[],[],[],[],[],[]] ];
let game=[];
let n;
let fieldNotActive=0;
let steps;
let timer;
let musicPlay=0;
let soundsPlay;


//Local Storage 
function setLocalStorage() {
    localStorage.setItem('size', n);
    localStorage.setItem('sounds', soundsPlay);
   
}


function getLocalStorage() {
    
    if(localStorage.getItem('size')) {
        n = Number(localStorage.getItem('size'));
        switch (n){
            case 3:{
                size.innerHTML="Very Easy (3x3)";
                break;           
            }
            case 4:{
                size.innerHTML="Easy (4x4)";
                break; 
            }
            case 5:{
                size.innerHTML="Normal (5x5)";
                break; 
            }
            case 6:{
                size.innerHTML="Hard (6x6)";
                break; 
            }
            case 7:{
                size.innerHTML="Very Hard (7x7)";
                break; 
            }
        }
        
        }
    else{
        n=3;
    }

    displayKnuckles(sampleArray[n-3]);
    fieldNotActive =1;

    musicButton.classList.add("notMusic");

    if(localStorage.getItem('sounds')) {
        soundsPlay = Number(localStorage.getItem('sounds'));     
        }
    else{
        soundsPlay =1;
    }
  

     if(soundsPlay == 0){
         soundsButton.classList.add("notMusic");
     }
      
}




window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);


// Create Standart/Win arrays

function creationStandardArrays(){
    for(let k = 3; k < 8; k++){
        let x = 1;
        for(let i = 0; i < k; i++){
            for(let j = 0; j < k; j++){
                sampleArray[k-3][i][j] = x.toString();
                x += 1;
            }
        }
        sampleArray[k-3][k-1][k-1] = "0";
    }
}

creationStandardArrays();

// Helper functions

function getRandomArrayElement(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

function arrayClone (arr) {
    var i, copy;
    
    if (Array.isArray(arr)) {
        copy = arr.slice(0);
        for (i = 0; i < copy.length; i++) {
            copy[i] = arrayClone(copy[i]);
        }
        return copy;
    } else {
        return arr;
    }
}


// Randon shaffle

function randomShift(arr, x, y){
    let masToChoise = [];

    if(!(typeof arr[x-1] === "undefined")){
        masToChoise.push([x-1, y]);
    }

    if(!(typeof arr[x+1] === "undefined")){
        masToChoise.push([x+1, y]);
    }

    if(!(typeof arr[x][y+1] === "undefined")){
        masToChoise.push([x, y+1]);
    }

    if(!(typeof arr[x][y-1] === "undefined")){
        masToChoise.push([x, y-1]);
    }

    let newCoord=getRandomArrayElement(masToChoise);
    arr[x][y] = arr[newCoord[0]][newCoord[1]];
    arr[newCoord[0]][newCoord[1]] = "0";
    x0 = newCoord[0];
    y0 = newCoord[1];
}

function creationGameMatrix(n){
    let arr = arrayClone(sampleArray[n-3]);
    x0 = n-1;
    y0 = n-1;
    for(let i = 0; i < 50*n; i++){
        randomShift(arr, x0,y0);
    }
    return arr;
}

// Display and clean the game

function displayKnuckles(arr){
    let dimension = arr.length;
    for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension; j++){
            var elem = document.createElement("div");
            elem.style.width = `${100 / dimension}%`;
            elem.style.height = `${100 / dimension}%`;
            elem.classList.add("block");
            elem.style.top = `${i*(100 / dimension)}%`;
            elem.style.left=`${j*(100 / dimension)}%`;
            var elem2=document.createElement("div");
            elem2.classList.add("insideBlock");

            elem2.innerHTML = arr[i][j];
            elem.appendChild(elem2);
            if(arr[i][j] !== "0"){
            field.appendChild(elem);
            }
        }
    }
}


function deleteGame(){
    let f= document.querySelectorAll(".block");
    for(let i=0; i<f.length; i++){
        field.removeChild(f[i]);
    }

    
}



// Play action

field.addEventListener("click",(event)=>{
  
    if(event.target.classList.contains("insideBlock") && fieldNotActive == 0){
        
        
        let x = userShift(game,event.target.textContent);
        let dist= 100 / game.length;

        switch(x) {
            case "down":{
                steps+=1;
                if(soundsPlay == 1){
                    sounds.play();
                }
                event.target.parentNode.style.top=Number(event.target.parentNode.style.top.slice(0, event.target.parentNode.style.top.length - 1)) + dist + "%";
                break;
            }
            case "up":{
                steps+=1;
                if(soundsPlay == 1){
                    sounds.play();
                }
                event.target.parentNode.style.top=Number(event.target.parentNode.style.top.slice(0, event.target.parentNode.style.top.length - 1))-dist + "%";
                break;
            }
            case "left":{
                steps+=1;
                if(soundsPlay == 1){
                    sounds.play();
                }
                event.target.parentNode.style.left=Number(event.target.parentNode.style.left.slice(0, event.target.parentNode.style.left.length - 1))-dist + "%";
                break;
            }
            case "right":{
                steps+=1;
                if(soundsPlay == 1){
                    sounds.play();
                }
                event.target.parentNode.style.left=Number(event.target.parentNode.style.left.slice(0 ,event.target.parentNode.style.left.length - 1)) + dist + "%";
                break;
            }
        }
    
    if(steps == 1000){
        steps = 999;
    }
    numberOfSteps.innerHTML=`Steps: ${steps}`;

        if(isWin(game, sampleArray[n-3])){
            fieldNotActive=1;
            win.style.display="flex";
     
            finalSteps.innerHTML=`${steps}`;
            finalTime.innerHTML=`${time.textContent}`;
            clearInterval(timer);    
           
           

        }
    }
})



function userShift(arr, textValue){

    if(!(typeof arr[x0-1] === "undefined")){
        if(arr[x0-1][y0] == textValue){
            arr[x0][y0] = textValue;
            arr[x0-1][y0] = "0";
           x0=x0-1;
          return "down";
        }
    }

    if(!(typeof arr[x0+1] === "undefined")){
        if(arr[x0+1][y0] == textValue){
            arr[x0][y0] = textValue;
            arr[x0+1][y0] = "0";
           x0=x0+1;
          return "up";
        }
    }

    if(!(typeof arr[x0][y0+1] === "undefined")){
        if(arr[x0][y0+1] == textValue){
            arr[x0][y0] = textValue;
            arr[x0][y0+1] = "0";
           y0=y0+1;
          return "left";
        }
    }

    if(!(typeof arr[x0][y0-1] === "undefined")){
        if(arr[x0][y0-1] == textValue){
            arr[x0][y0] = textValue;
            arr[x0][y0-1] = "0";
           y0=y0-1;
          return "right";
        }
    }

    return false;
}

function isWin(arr, standart){
    let x=true;
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr.length; j++){
            if(arr[i][j] != standart[i][j]){
            x=false;
            }
        }
    }
    return x;
}

// Choice size


size.addEventListener("click", ()=>{
    size.classList.add("hide");
    sizeOptions.classList.add("show");
    greyFon.style.display="block";
   for(let i=0; i<sizeChoice.length; i++){
    sizeChoice[i].style.color= "aliceblue";
   }
   sizeChoice[n-3].style.color= "green";
})


sizeOptions.addEventListener("click", (event)=>{
    size.innerHTML=event.target.textContent;
    switch (event.target.textContent){
        case "Very Easy (3x3)":{
            n=3; 
            break;           
        }
        case "Easy (4x4)":{
            n=4; break;
        }
        case "Normal (5x5)":{
            n=5; break;
        }
        case "Hard (6x6)":{
            n=6; break;
        }
        case "Very Hard (7x7)":{
            n=7; break;
        }
    }

    greyFon.style.display="none";
    size.classList.remove("hide");
    sizeOptions.classList.remove("show");
    deleteGame();
    displayKnuckles(sampleArray[n-3]);
    fieldNotActive=1;
    steps=0;
    numberOfSteps.innerHTML=`Steps: ${steps}`;

    clearInterval(timer);    
     time.innerHTML ="Time";
    
})

greyFon.addEventListener("click",()=>{
    greyFon.style.display="none";
    size.classList.remove("hide");
    sizeOptions.classList.remove("show");
})


// Create new game ant time

newGame.addEventListener("click",()=>{
    clearInterval(timer);    
     time.innerHTML ="Time";
    deleteGame();
    game = creationGameMatrix(n);
    displayKnuckles(game);
    steps=0;
    numberOfSteps.innerHTML=`Steps: ${steps}`;
    fieldNotActive=0;
    var allTime = 0;
    var seconds=0;
    var minutes=0;

    timer= setInterval(function() {
       
       
             allTime ++;
             minutes=(allTime - allTime % 60)/60;
             seconds=allTime - 60*minutes;
             
             if(seconds<10){
                 seconds="0"+seconds;
             }
             if(minutes<10){
                 minutes="0"+minutes;
             }
             if(allTime == 3600){
                allTime = 3599;
             }
 
             time.innerHTML = `${minutes}:${seconds}`;

            }, 1000)


})

// Win 

win.addEventListener("click",(event)=>{
    if(event.target.classList.contains("win")){
        win.style.display="none";
        time.innerHTML ="Time";
        steps=0;
        numberOfSteps.innerHTML=`Steps`;
        
        
    }
    else{
        
    }
    
})




musicButton.addEventListener("click", ()=>{
    musicButton.classList.toggle("notMusic")
    if(musicPlay == 1){
        musicPlay = 0;
        audio.pause();
    }
    else{
        audio.play();
        musicPlay = 1;
    }
})


soundsButton.addEventListener("click", ()=>{
    soundsButton.classList.toggle("notMusic")
    if(soundsPlay == 1){
        soundsPlay = 0;
    }
    else{
        soundsPlay = 1;
    }
})



const statisticButtons=document.querySelectorAll(".nsn");
const statisticDiv=document.querySelectorAll(".top10");




function showNResults(n){
   
    for(let i =0; i<5; i++){
        statisticDiv[i].classList.remove('showTop10');
        statisticButtons[i].classList.remove("checkNSN");
    }
    statisticDiv[n].classList.add("showTop10");
    statisticButtons[n].classList.add("checkNSN");
}


statisticButtons[0].addEventListener("click",()=>{
    showNResults(0);
})
statisticButtons[1].addEventListener("click",()=>{
    showNResults(1);
})

statisticButtons[2].addEventListener("click",()=>{
    showNResults(2);
})

statisticButtons[3].addEventListener("click",()=>{
    showNResults(3);
})
statisticButtons[4].addEventListener("click",()=>{
    showNResults(4);
})








sendform.addEventListener('click',()=>{
    
    let data = new FormData();
    data.append("name", username.value);

    var tim=  time.textContent.split(":");
    var timeToSec=Number(tim[0])*60+Number(tim[1]);
    data.append("time", timeToSec); 
    data.append("steps", steps); 
    data.append("n", n); 
    fetch(`https://script.google.com/macros/s/AKfycbxypQPu6h5bXw54JqmHke8EMme-I7G4sFQMCJflQeye-IOPEBRr614_3vWQn-obHQYp/exec`, { method: "POST", mode: 'no-cors', body: data })
    win.style.display="none";
    time.innerHTML ="Time";
    steps=0;
    numberOfSteps.innerHTML=`Steps`;
    username.value="";
    setTimeout(getResults(), 5000);
})


results.addEventListener("click",()=>{
    resultsDiv.style.display="flex";
})

resultsDiv.addEventListener("click",(event)=>{
    getResults()
    if(event.target.classList.contains("resultsDiv")){
        resultsDiv.style.display="none";
    }
    else{
        
    }
  
})

getResults();


function getResults(){

    fetch('https://script.google.com/macros/s/AKfycbyjGq_o7VRFQ2HGhEpBv4CGdOZgfhVJhflQr-yZYssi2dnAaK7m8gNoH1JAKbsJE339/exec?n=3')
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then( function (json){
        
         paintResults(json,0)})
    .catch( err => console.error(`Fetch problem: ${err.message}`) );


    fetch('https://script.google.com/macros/s/AKfycbyjGq_o7VRFQ2HGhEpBv4CGdOZgfhVJhflQr-yZYssi2dnAaK7m8gNoH1JAKbsJE339/exec?n=4')
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then( function (json){
        paintResults(json,1)})
    .catch( err => console.error(`Fetch problem: ${err.message}`) );


    fetch('https://script.google.com/macros/s/AKfycbyjGq_o7VRFQ2HGhEpBv4CGdOZgfhVJhflQr-yZYssi2dnAaK7m8gNoH1JAKbsJE339/exec?n=5')
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then( function (json){
        paintResults(json,2)})
    .catch( err => console.error(`Fetch problem: ${err.message}`) );


    fetch('https://script.google.com/macros/s/AKfycbyjGq_o7VRFQ2HGhEpBv4CGdOZgfhVJhflQr-yZYssi2dnAaK7m8gNoH1JAKbsJE339/exec?n=6')
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then( function (json){
        paintResults(json,3)})
    .catch( err => console.error(`Fetch problem: ${err.message}`) );


    fetch('https://script.google.com/macros/s/AKfycbyjGq_o7VRFQ2HGhEpBv4CGdOZgfhVJhflQr-yZYssi2dnAaK7m8gNoH1JAKbsJE339/exec?n=7')
    .then( response => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then( function (json){
        paintResults(json,4)})
    .catch( err => console.error(`Fetch problem: ${err.message}`) );


//   Все запісі надо делать в этіх функціях 
    



}


function paintResults(array, n){


while (statisticDiv[n].firstChild) {
   statisticDiv[n].removeChild(statisticDiv[n].firstChild);
}


array.sort(function(a,b){
    return a[2]-b[2]
});


var userelem=document.createElement("div");
    userelem.classList.add("userResult");
    var userNick=document.createElement("div");
    userNick.classList.add("userNick");
    userNick.innerHTML=`Name`;
    userelem.appendChild(userNick);
    var userTime=document.createElement("div");
    userTime.classList.add("userTime");
    userTime.innerHTML=`Time`;
    userelem.appendChild(userTime);
    var userSteps=document.createElement("div");
    userSteps.classList.add("userSteps");
    userSteps.innerHTML=`Steps`;
    userelem.appendChild(userSteps);
    statisticDiv[n].appendChild(userelem);




for(let i=0; i<10; i++){
    var userelem=document.createElement("div");
    userelem.classList.add("userResult");
    var userNick=document.createElement("div");
    userNick.classList.add("userNick");
    userNick.innerHTML=`${i+1}. ${array[i][0]}`;
    userelem.appendChild(userNick);
    var userTime=document.createElement("div");
    userTime.classList.add("userTime");
    
    var userMinutes=(array[i][1] - array[i][1] % 60)/60;
    var userSeconds=array[i][1] - 60*userMinutes;
    
    if(userSeconds<10){
        userSeconds="0"+userSeconds;
    }
    if(userMinutes<10){
        userMinutes="0"+userMinutes;
    }
      
    userTime.innerHTML=`${userMinutes}:${userSeconds}`;
    userelem.appendChild(userTime);
    var userSteps=document.createElement("div");
    userSteps.classList.add("userSteps");
    userSteps.innerHTML=array[i][2];
    userelem.appendChild(userSteps);
        statisticDiv[n].appendChild(userelem);

}


}

