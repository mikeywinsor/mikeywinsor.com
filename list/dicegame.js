const db = firebase.firestore();
const docLastRoll = db.collection("dice").doc("lastRoll");
const docRef = db.collection("funmoney").doc("amounts");
const docHistory = db.collection("funmoney").doc("history");

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
let userEmail = "";
let lastPayoutDate = null;
let streakName = "";
let streakCount = 9;
let streakData = "";
let oneRollToday = null;
let allDiceData = "";
let mRollDate = '';
let yRollDate = '';
let currentRollerMikey = '';
let gameTie = false;
let winner = "";
let winnerPrinted = false;
let bStyle = ["solid","groove","dashed","dotted"];
let t="";
let a = 0;

let mikeyMoney = 0.01;
var mikeyHistory = null;
let yokoMoney = 0.01;
let yokoHistory = null;
let funMoneyData = '';
let historyAll = '';


const diceArea = document.getElementById('diceArea');
const diceM = document.getElementById('dice-M');
const diceY = document.getElementById('dice-Y');
const diceImage = document.getElementById('dice-image');
const yRollButton = document.getElementById('yokoRollButton');
const mRollButton = document.getElementById('mikeyRollButton');
const loginBlock = document.getElementById('login');
const streakDiv = document.getElementById('streak');
const mColumn = document.getElementById("m-column");
const yColumn = document.getElementById("y-column");
const miTo = document.getElementById("miTo");
const yoTo = document.getElementById("yoTo");

const isToday = (compareDate) => {
    const today = new Date()
    return compareDate.getDate() == today.getDate() &&
      compareDate.getMonth() == today.getMonth() &&
      compareDate.getFullYear() == today.getFullYear()
  }

const isSameDay = (compareDateA, compareDateB) => {
    return compareDateA.getDate() == compareDateB.getDate() &&
     compareDateA.getMonth() == compareDateB.getMonth() &&
     compareDateA.getFullYear() == compareDateB.getFullYear()
    }

document.onload = pageLoad();

function pageLoad(){
    diceArea.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
            fetchDataRefresh();
            docLastRoll.onSnapshot(function(doc) {
            fetchDataRefresh();
            });
        } else {
            console.log('not logged in');
            displayLogin();
        }
        userEmail = user.email;
        if (userEmail == "mikeywinsor@gmail.com" || userEmail == "bogo@boogle.com" || userEmail == "chicago@boogle.com"){
            currentRollerMikey = true;
        } else if (userEmail == "yoko@boogle.com" || userEmail == "yokotesting@boogle.com" ){
            currentRollerMikey = false;
        }
      });
}

function fetchDataRefresh(){
    docLastRoll.get().then(function(doc) {
        if (doc.exists) {
            allDiceData = doc.data();
            streakName = allDiceData["streakWho"];
            streakCount = allDiceData["streakCount"];
            oneRollToday = allDiceData["oneRollToday"];
            lastPayoutDate = new Date(allDiceData["previousRewardDate"].toDate());
            mRollDate = new Date(allDiceData["mDate"].toDate());
            yRollDate = new Date(allDiceData["yDate"].toDate());
            mikeyScore = allDiceData["mikey"];
            yokoScore = allDiceData["yoko"];
            miTo.innerHTML = "mikey total: " + allDiceData.mTotal;
            yoTo.innerHTML = "yoko total: " +allDiceData.yTotal;
            updateStreak();
            if (isToday(lastPayoutDate)){
                noMorePayouts(); 
            }else{
                if (!isToday(mRollDate)){mikeyScore = 0; if (currentRollerMikey){mRollButton.style.display = "block"}};
                if (!isToday(yRollDate)){yokoScore = 0; if (!currentRollerMikey){yRollButton.style.display = "block"}};
                loadFunMoney();
            }
            updateScoresOnDice();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;

}

function updateStreak(){
    streakDiv.innerText = "Streak: " + streakName + " " + streakCount;
}

function noMorePayouts(){
    yRollButton.style.display = "none";
    mRollButton.style.display = "none";
}

function checkUnpaid(){
    if(isSameDay(mRollDate,yRollDate)){
        console.log('same day past');
     }
    if (!isSameDay(mRollDate,yRollDate) && !isToday(mRollDate) && !isToday(yRollDate)){
        console.log('different days, and no roll today');
        let newSameDate = "";
        let winnings = .5;
        if(mRollDate>yRollDate){
            winner = "mikey";
            newSameDate = mRollDate;
        }else{
            winner = "yoko";
            newSameDate = yRollDate;
        }
        if (streakName == winner){streakCount += 1}else{streakCount = 1};
        if(streakCount == 5){streakCount = 1; winnings+=5};
        writeToFunmoneyDatabase(winnings);
        dbAllDatesUpdate(newSameDate);
     }
}

function dbAllDatesUpdate(newDate){
    let newTotal = 0;
    let peTo = "mTotal";
    if (winner == "mikey"){newTotal = allDiceData.mTotal + 1}
    if (winner == "yoko"){newTotal = allDiceData.yTotal +1; peTo = "yTotal";}
    docLastRoll.set({
        oneRollToday : false,
        yDate : newDate,
        mDate : newDate,
        [peTo] : newTotal,
        previousRewardDate : newDate,
        streakWho : winner,
        streakCount : streakCount
    }, { merge: true });
}


function displayLogin(){
    loginBlock.style.display = 'block';
}

function updateScoresOnDice(){
    diceM.src = mikeyScore + `.png`;
    diceY.src = yokoScore + `.png`;
    if(mikeyScore != 0 && yokoScore != 0){
        if (mikeyScore>yokoScore && !winnerPrinted){
            mColumn.innerHTML += "Winner";
            winnerPrinted = true;
            t = setInterval("winnerAni(mColumn)",500);
        }
        if (yokoScore>mikeyScore && !winnerPrinted){
            yColumn.innerHTML += "Winner";
            winnerPrinted = true;
            t = setInterval("winnerAni(yColumn)",500);
        }
    }
}

function winnerAni(box){
    let rand = makeRandoColor();
    box.style = `background-color:${rand}; border-style:${bStyle[a]}`;
    a ++;
    if(a>=4){a=0};
}

function makeRandoColor(){
    var rc = 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
    (Math.floor((256-190)*Math.random()) + 220) + ',' + 
    (Math.floor((256-190)*Math.random()) + 200) + ')';
    return rc;
}

function rollDice(){
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
        if (currentRollerMikey){mikeyScore=lastDiceRoll}else{yokoScore=lastDiceRoll};
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
    updateScoresOnDice()
    computeDiceRoll();
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

function computeDiceRoll(){
    let payoutPrevious = new Date(lastPayoutDate);
    let rightNow = new Date();
    let roller = [];
    let payOut = .5;
    if(currentRollerMikey){
        roller = ["mikey","mDate", false,"mikey",1];
        if(streakName == "mikey"){roller[4]=streakCount + 1}
        if(yokoScore == 0){roller[2] = true; roller[3] = streakName; roller[4]= streakCount};
    }else {
        roller = ["yoko","yDate",false,"yoko",1];
        if(streakName == "yoko"){roller[4]=streakCount + 1}
        if(mikeyScore == 0){roller[2] = true; roller[3] = streakName; roller[4]= streakCount};
    }
    let peTo = "mTotal";
    let totalNumber = allDiceData.mTotal;
    if(mikeyScore != 0 && yokoScore != 0){
        if(mikeyScore>yokoScore || yokoScore>mikeyScore){
            if (yokoScore>mikeyScore){
                roller[3]="yoko";
                winner="yoko";
                totalNumber = allDiceData.yTotal + 1;
                peTo = "yTotal";
                if(streakName == "yoko"){roller[4]=streakCount + 1}else{roller[4]=1};
            }
            if (mikeyScore>yokoScore){
                roller[3]="mikey";
                winner="mikey";
                totalNumber = allDiceData.mTotal + 1;
                if(streakName == "mikey"){roller[4]=streakCount + 1}else{roller[4]=1};
            }
            if(roller[4] == 5){payout += 5; roller[4] = 1; celebrateStreak();}
            writeToFunmoneyDatabase(payOut);
        }
        if(mikeyScore == yokoScore){
            roller[3] = "tie";
            if (streakName == "mikey" || streakName == "yoko"){
                roller[4] = 1;
            } 
            gameTie = true; 
            writeToFunmoneyDatabase(.25);
        }
        payoutPrevious = new Date();
    }

    docLastRoll.set({
        [roller[0]] : lastDiceRoll,
        [roller[1]] : rightNow,
        [peTo] : totalNumber,
        oneRollToday : roller[2],
        streakWho : roller[3],
        streakCount : roller[4],
        previousRewardDate : payoutPrevious
    }, { merge: true });

}

function writeToFunmoneyDatabase(amount){
    let junk = '';
    mikeyHistory = historyAll["mikey"].split(',');
    yokoHistory= historyAll["yoko"].split(',');
    amount = parseFloat(amount);
    if (gameTie || winner == "mikey"){
        mikeyMoney = parseFloat(mikeyMoney);
        mikeyMoney = mikeyMoney + amount;
        junk = mikeyHistory.unshift(amount);
        junk = mikeyHistory.pop();
        let toAppend = mikeyHistory.toString();
        docHistory.set({
            mikey : toAppend
        }, { merge: true });
        docRef.set({
            mikey : mikeyMoney
        }, { merge: true });
    }
    if (gameTie || winner == "yoko"){
        yokoMoney = parseFloat(yokoMoney);
        yokoMoney = yokoMoney + amount;
        junk = yokoHistory.unshift(amount);
        junk = yokoHistory.pop();
        let toAppend = yokoHistory.toString();
        docHistory.set({
            yoko : toAppend
        }, { merge: true });
        docRef.set({
           yoko : yokoMoney
        }, { merge: true });
    }
    // console.log(amount);
}

function celebrateStreak(){
    console.log('good job');
    alert("$5 streak win");
}

function loadFunMoney(){
    docRef.get().then(function(doc) {
        if (doc.exists) {
            funMoneyData = doc.data(); 
            mikeyMoney = funMoneyData.mikey;
            yokoMoney = funMoneyData.yoko;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
    loadFunMoneyHistory();
}

function loadFunMoneyHistory(){
    docHistory.get().then(function(doc) {
        if (doc.exists) {
            historyAll = doc.data();
            checkUnpaid();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
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


  