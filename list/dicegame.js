const db = firebase.firestore();

let mCheckedIn = false;
let yCheckedIn = false;

let randomRoll = 0;
let randomRotation = 0;
let bounceX = 20;
let bounceY = 61;
let bounceCeiling = 60;
let bounceFloor = 220;
let bounces = 5;
let bounceUpwards = false;
let lastDiceRoll = 0;
let diceSpeed = 40;
let b = null;
let mikeyScore = 0;
let yokoScore = 0;
let currentDiceRollerMikey = true;
let userEmail = "";

const diceArea = document.getElementById('diceArea');
const diceM = document.getElementById('dice-M');
const diceY = document.getElementById('dice-Y');
const diceImage = document.getElementById('dice-image');
const yRollButton = document.getElementById('yokoRollButton');
const mRollButton = document.getElementById('mikeyRollButton');
const loginBlock = document.getElementById('login');

document.onload = pageLoad();

function pageLoad(){
    updateScoresOnDice();
    diceArea.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
        } else {
            console.log('not logged in');
            displayLogin();
        }
        userEmail = user.email;
        if (userEmail == "mikeywinsor@gmail.com" || userEmail == "bogo@boogle.com"){
            mRollButton.style.display = 'block';
        } else if (userEmail == "yoko@boogle.com"){
            mRollButton.style.display = 'block';
        }
      });
    
}

function displayLogin(){
    loginBlock.style.display = 'block';
}


function updateScoresOnDice(){
    //need to load values from DB
    diceM.src = mikeyScore + `.png`;
    diceY.src = yokoScore + `.png`;
}

function rollDice(name){
    currentDiceRollerMikey = name;
    resetBouncesVariables();
    setTimeout("startRoll()",400);
    yRollButton.style.display = "none";
    mRollButton.style.display = "none";
    diceArea.style.display = "block";
}

function startRoll(){
    b = setInterval(changeNumber, diceSpeed);
}


function changeNumber(){
    rollNumber();
    diceImage.setAttribute('src',`${randomRoll}.png`);
    diceImage.style.top = bounceY + 'px';
    diceImage.style.left = bounceX + 'px';
    diceImage.style.transform = `rotate(${randomRotation}deg)`;
    bounceX += 2;
    calcBounce();
    if (bounces == 0){
        stopDice();
        lastDiceRoll = randomRoll;
    }
}

function calcBounce(){
    if (bounceUpwards){
        bounceY = bounceY * .9;
        if (bounceY<=bounceCeiling){
            bounceUpwards = false;
        }
    }else{
        bounceY = bounceY * 1.1;
        if (bounceY>=bounceFloor){
            bounceUpwards = true;
            bounceCeiling += 20;
            diceSpeed += 20;
            bounces --;
        }
    }

}

function resetBouncesVariables(){
    bounceCeiling = 60;
    bounceX = 25;
    bounceY = 40;
    diceSpeed = 35;
    bounces = Math.floor(Math.random() * 3) + 3;
    bounceUpwards = false;
}

function rollNumber() {
    randomRoll = Math.floor(Math.random() * 6) + 1;
    randomRotation = Math.floor(Math.random() * 360) + 1;
}

function stopDice(){
    clearInterval(b);
    dieLayFlat();
    setTimeout('closeDiceRoll()', 800);
}

function dieLayFlat(){
    while (randomRotation > 0){
        randomRotation--;
        diceImage.style.transform = `rotate(${randomRotation}deg)`;
        diceImage.style.top = bounceFloor + 10 + 'px';
    }

}

function closeDiceRoll(){
    fadeOut();
    if (currentDiceRollerMikey){
        diceM.src = lastDiceRoll + '.png';
    }else{
        diceY.src = lastDiceRoll + '.png';
    }

}

function fadeOut(){
    let fadeTarget = diceArea;
    let scale = 1;
    setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
            diceImage.style.scale = scale;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.05;
            scale += .05;
            diceImage.style.scale = scale;
            diceImage.style.position.top += 1;
        } else {
            clearInterval(this);
        }
    }, 50);

}


let loginButton = document.getElementById('loginButton');
loginButton.addEventListener("click",login);

function login(){
    let email = document.getElementById('emailField').value;
    let password = document.getElementById('passField').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        window.alert('Invalid Credentials');
      });
      //if login successful replace please log in with items
     firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            ;
        } 
      });
      
}