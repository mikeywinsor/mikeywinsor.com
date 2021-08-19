const db = firebase.firestore();
const docDice = db.collection("dice").doc("dice2");
const docFM = db.collection("funmoney").doc("amounts");
const docFMH = db.collection("funmoney").doc("history");

const loginBlock = document.getElementById("login-block");
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener("click",login);

let funMoneyData = null;
let mikeyMoney = null;
let yokoMoney = null;
let historyAll = null;

let playerName = '';
let allDiceData = [];
let streakName = '';
let streakCount = 0;
let mikeyLastRoll = '';
let yokoLastRoll = '';
let mikeyLastRollDate = '';
let yokoLastRollDate = '';
let mikeyTotal = null;
let yokoTotale = null;
let lastPayoutAmount = null;
let lastPayoutDate = '';
let historyYScore = 0;
let historyMScore = 0;
let historyAmount = 0;
let historyWhoWon = "";

let currentStreakWho = '';
let currentStreakCount = 0;
let todayMikeyScore = 0;
let todayYokoScore = 0;
let t = "";

let rollingDie = '';
let rolledDie = 0;
let rollingInterval = null;
let rollingTopMax = 0;
let rollingLeftMax = 0;
let rollingRightMax = 0;
let rollingBottomMax = 0;
let rollingDown = true;
let rollingRight = true;
let hasntRolledToday = false;

const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');
const leftBottom = document.getElementById("left-bottom");
const rightBottom = document.getElementById("right-bottom");
const leftBottomB = document.getElementById("left-bottomB");
const rightBottomB = document.getElementById("right-bottomB");
const rollingArea = document.getElementById("rolling-area");
const historyBlock = document.getElementById("historyBlock");

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


// page Load
document.onload =pageLoad();
function pageLoad(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
            userEmail = user.email;
            if (userEmail == "mikey@boogle.com" || userEmail == "m@boogle.com" || userEmail == "mm@boogle.com"){
                playerName = "mikey";
            }
            if (userEmail == "yoko@boogle.com" || userEmail == "pogo@boogle.com"){
                playerName = "yoko";
            }
            docDice.onSnapshot(function(doc) {
                refreshPage();
            });
        } else {
            loginBlock.style.display = 'block';
            console.log('not logged in');
        }
      });

}

function refreshPage(){
    docDice.get().then(function(doc) {
        if (doc.exists) {
            loadFunMoney();
            hasntRolledToday = false;
            rollingArea.innerHTML = '';
            allDiceData = doc.data();
            streakName = allDiceData["streakWho"];
            streakCount = allDiceData["streakCount"];
            lastPayoutAmount = allDiceData["lastPayoutAmount"];
            lastPayoutDate = new Date(allDiceData["lastPayoutDate"].toDate());
            mikeyLastRollDate = new Date(allDiceData["mikeyLastRollDate"].toDate());
            yokoLastRollDate = new Date(allDiceData["yokoLastRollDate"].toDate());
            mikeyLastRoll = allDiceData["mikeyLastRoll"];
            yokoLastRoll = allDiceData["yokoLastRoll"];
            currentStreakWho = allDiceData["streakWho"];
            currentStreakCount = allDiceData["streakCount"];
            historyYScore = allDiceData["historyLastRollYoko"];
            historyMScore = allDiceData["historyLastRollMikey"];
            historyWhoWon = allDiceData["historyWho"];
            historyAmount = allDiceData["historyPayout"];
            mikeyTotal = allDiceData.mikeyTotal;
            yokoTotal = allDiceData.yokoTotal;
            leftBottom.innerHTML = "mikey total: " + mikeyTotal;
            rightBottom.innerHTML = "yoko total: " + yokoTotal;
            if(isToday(lastPayoutDate)){
                todayMikeyScore = mikeyLastRoll;
                todayYokoScore = yokoLastRollDate;
                if(streakCount ==0){
                    rollingArea.innerHTML +=  `<div style='text-align: center;'>${streakName} $5 streak win!</div>`;
                }
            };
            checkNoRollWins();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
}

function loadFunMoney(){
    docFM.get().then(function(doc) {
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
    docFMH.get().then(function(doc) {
        if (doc.exists) {
            historyAll = doc.data();
            //checkUnpaid();
            leftBottom.innerHTML += `<br>$${mikeyMoney}`;
            rightBottom.innerHTML += `<br>$${yokoMoney}`;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
}


function checkNoRollWins(){
    if(isSameDay(yokoLastRollDate, mikeyLastRollDate)){
        updateRollNumbers();
    }else{
        if(!isToday(mikeyLastRollDate) && !isToday(yokoLastRollDate)){
            if(mikeyLastRollDate > yokoLastRollDate){
                winPast("mikey",mikeyLastRollDate);
            }else if(yokoLastRollDate > mikeyLastRollDate){
                winPast("yoko",yokoLastRollDate);
            }
        }else{
        updateRollNumbers();
        }
    }
}

function updateRollNumbers(){
    historyBlock.innerHTML = `Previous Win: ${historyWhoWon}, $ ${historyAmount}`;
    leftBottomB.style = "border: none;";
    rightBottomB.style = "border: none;";
    rightBottomB.innerHTML = `<img height='24px' src="${historyYScore}.png">`;
    leftBottomB.innerHTML = `<img height='24px' src="${historyMScore}.png">`;
    if(isToday(mikeyLastRollDate)){
        leftColumn.innerHTML = `mikey<br><img src="${mikeyLastRoll}.png">`;
        todayMikeyScore = mikeyLastRoll;
    }else if(playerName == "mikey"){
        hasntRolledToday = true;
        leftColumn.innerHTML = `mikey<br><img src="nr.png">`;
    }
    if(isToday(yokoLastRollDate)){
        rightColumn.innerHTML = `yoko<br><img src="${yokoLastRoll}.png">`;
        todayYokoScore = yokoLastRoll;
    }else if(playerName == "yoko"){
        hasntRolledToday = true;
        rightColumn.innerHTML = `yoko<br><img src="nr.png">`;
    }
    if(currentStreakWho == "yoko"){
        rightColumn.innerHTML = `yoko<br><img src="${yokoLastRoll}.png"><br>streak: ${currentStreakCount}`;
    }else if (currentStreakWho == "mikey"){
        leftColumn.innerHTML = `mikey<br><img src="${mikeyLastRoll}.png"><br>streak: ${currentStreakCount}`;
    }
    if (hasntRolledToday){
        rollingArea.innerHTML += `<br><a onclick='rollDice()'><div style="text-align: center; border-style: solid;
                                    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
                                    width: 33%; left: 33%;
                                    ">${playerName}<br><img src="${rolledDie}.png"></img><br>roll dice !!!<div></a>`;
    }
    if (isToday(lastPayoutDate)){
        let playerWinnings = null;
        if(currentStreakWho == playerName){
            playerWinnings = lastPayoutAmount;
        } else {playerWinnings = "nothing"};
        if (currentStreakWho == "tie"){
            rollingArea.innerHTML += `<br><div style="text-align: center; border-style: solid;
                                    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
                                    width: 33%; left: 33%;
                                    ">Tie! <br><br>. . .<br>Today you won a Quarter!<br>...<div>`;
        } else {
            rollingArea.innerHTML += `<br><div style="text-align: center; border-style: solid;
                                    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
                                    width: 33%; left: 33%;
                                    ">${playerName} <br><br>. . .<br>today you won ${playerWinnings}<br>...<div>`;
        }
        if(currentStreakWho == "yoko"){t = setInterval("winnerAni(rightColumn)",500)}
        if(currentStreakWho == "mikey"){t = setInterval("winnerAni(leftColumn)",500)}
    }
}


////// Calculating Winnings

function calculateRoll(){
    if(playerName == "mikey"){
        leftColumn.innerHTML = `mikey<br><img src="${rolledDie}.png"></img>`;
        todayMikeyScore = rolledDie;
    }
    if(playerName == "yoko"){
        rightColumn.innerHTML = `yoko<br><img src="${rolledDie}.png"></img>`;
        todayYokoScore = rolledDie;
    }
    if(!isToday(lastPayoutDate) && todayMikeyScore!=0 && todayYokoScore!=0){
        if(todayYokoScore == todayMikeyScore){
            tieToday();
        }
        if(todayMikeyScore > todayYokoScore){
            winToday("mikey");
        }
        if(todayYokoScore > todayMikeyScore){
            winToday("yoko");
        }
    }else{
        writeRoll();
    }
    
}

function writeRoll(){
    // add roll, roll date, to db
    rollingArea.innerHTML = "writing roll to database";
    let rollerName = playerName + "LastRoll";
    let rollerDate = playerName + "LastRollDate";
    let today = new Date();
    docDice.set(
        {[rollerDate]: today,
        [rollerName]: rolledDie},
        {merge: true}
    )
}

function winPast(pastWinner,dateToUpdate){
    rollingArea.innerHTML = `<br><div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 33%; left: 33%;
    "><br>${pastWinner} wins<br>other player<br>did not roll<br>adding to database...<br><div>`
    let newStreakCount = 1;
    let newStreakWho = pastWinner;
    let payoutAmount = .5;
    if(currentStreakWho == pastWinner){
        newStreakCount = currentStreakCount +1;
        if (newStreakCount == 5){
            payoutAmount = 5;
            newStreakCount = 0;
            rollingArea.innerHTML +=  `<br>${pastWinner} $5 streak win!`;
        }
    }
    let newTotal = null;
    let newTotalWho = pastWinner + "Total";
    let mikeyHistoryScore = 0;
    let yokoHistoryScore = 0;
    if(pastWinner == "mikey"){
        newTotal = mikeyTotal +1;
        mikeyHistoryScore = mikeyLastRoll;
    }else if (pastWinner == "yoko"){
        newTotal = yokoTotal +1;
        yokoHistoryScore = yokoLastRoll;
    }
    docDice.set(
        {historyWho: pastWinner,
        historyPayout: payoutAmount,
        historyLastRollMikey: mikeyHistoryScore,
        historyLastRollYoko: yokoHistoryScore,
        lastPayoutAmount: payoutAmount,
        lastPayoutDate: dateToUpdate,
        mikeyLastRollDate: dateToUpdate,
        yokoLastRollDate: dateToUpdate,
        streakWho: newStreakWho,
        streakCount: newStreakCount,
        [newTotalWho]: newTotal},
        { merge: true }
    )
    writeToFunmoneyDatabase(pastWinner,payoutAmount);
    //write money (payoutAmount) to (streakWho)'s funmoney db
}

function winToday(winner){
    //calculate winnings and update DB fun money 
    //updatte dice db with lastpayoutdate, last roll date, 
    rollingArea.innerHTML = `<br><div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 33%; left: 33%;
    "><br>${winner} Wins<br><br>adding to database...<br><div>`
    let newStreakCount = 1;
    let newStreakWho = winner;
    let payoutAmount = .5;
    let dateToUpdate = new Date();
    if(currentStreakWho == winner){
        newStreakCount = currentStreakCount +1;
        if (newStreakCount == 5){
            payoutAmount = 5;
            newStreakCount = 0;
            rollingArea.innerHTML +=  `<br>${winner} $5 streak win!`;
        }
    }
    let newTotal = null;
    let newTotalWho = winner + "Total";
    let whoLastRoll = playerName + "LastRoll";
    if(winner == "mikey"){
        newTotal = mikeyTotal +1;
    }else if (winner == "yoko"){
        newTotal = yokoTotal +1;
    }
    console.log("write winner ");
    docDice.set(
        {
        historyWho: winner,
        historyPayout: payoutAmount,
        historyLastRollMikey: todayMikeyScore,
        historyLastRollYoko: todayYokoScore,
        lastPayoutAmount: payoutAmount,
        lastPayoutDate: dateToUpdate,
        mikeyLastRollDate: dateToUpdate,
        yokoLastRollDate: dateToUpdate,
        streakWho: newStreakWho,
        streakCount: newStreakCount,
        [whoLastRoll]: rolledDie,
        [newTotalWho]: newTotal},
        { merge: true }
    )
    //write money (payoutAmount) to winner, (streakWho)'s funmoney db
    writeToFunmoneyDatabase(winner,payoutAmount);
}


function tieToday(){
    rollingArea.innerHTML = `<br><div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 33%; left: 33%;
    "><br> tie <br> today  <br>. . .<br>you win .25<br>. . .<div>`;
    // update db today last payout, streak count 0, streak who tie.
    // add .25 to fun money, notify on rollingare, .25 paid out\
    let tiePayout = .25;
    if(streakName == "tie"){streakCount ++}
    let today = new Date();
    console.log("write tie ");
    docDice.set(
        {lastPayoutAmount: tiePayout,
        lastPayoutDate: today,
        mikeyLastRollDate: today,
        yokoLastRollDate: today,
        streakWho: "tie",
        historyWho: "tie",
        historyPayout: tiePayout,
        historyLastRollMikey: todayMikeyScore,
        historyLastRollYoko: todayYokoScore,
        streakCount: streakCount,
        mikeyLastRoll: todayMikeyScore,
        yokoLastRoll: todayYokoScore},
        { merge: true }
    )
    writeToFunmoneyDatabase("mikey",.25);
    writeToFunmoneyDatabase("yoko",.25);

}
////////////  Write Money to fun money Database

function writeToFunmoneyDatabase(who,amount){
    let junk = '';
    mikeyHistory = historyAll["mikey"].split(',');
    yokoHistory= historyAll["yoko"].split(',');
    amount = parseFloat(amount);
    if (who == "mikey"){
        mikeyMoney = mikeyMoney * 1;
        mikeyMoney += amount;
        let newBal = (mikeyMoney.toFixed(2)).toString();
        junk = mikeyHistory.unshift(amount.toString());
        junk = mikeyHistory.pop();
        let toAppend = mikeyHistory.toString();
        docFMH.set({
            mikey : toAppend
        }, { merge: true });
        docFM.set({
            mikey : newBal
        }, { merge: true });
    }
    if (who == "yoko"){
        yokoMoney = yokoMoney * 1;
        yokoMoney += amount;
        let newBal = (yokoMoney.toFixed(2)).toString();
        junk = yokoHistory.unshift(amount.toString());
        junk = yokoHistory.pop();
        let toAppend = yokoHistory.toString();
        docFMH.set({
            yoko : toAppend
        }, { merge: true });
        docFM.set({
           yoko : newBal
        }, { merge: true });
    }
    // console.log(amount);
}





//////////// Dice Roll and animation things

function rollDice(){
    rollingArea.innerHTML = "";
    let randomRoll = randomRollNumber();
    let rollingDie = document.createElement('img');
    rollingDie.setAttribute(`src`,`${randomRoll}.png`);
    rollingDie.setAttribute(`id`,"rolling-Die")
    rollingDie.style.position = "absolute";
    rollingArea.insertAdjacentElement('beforebegin',rollingDie);
    calcMaxes();
    setTimeout(startRoll,600);
}

function calcMaxes(){
    rollingDie = document.getElementById('rolling-Die');
    rollingLeftMax = rollingDie.offsetLeft + 2;
    rollingTopMax = rollingDie.offsetTop;
    rollingRightMax = rollingLeftMax + 250;
    rollingBottomMax = rollingTopMax + 118;
}

function startRoll(){
    rollingDie = document.getElementById('rolling-Die');
    let randomRoll = randomRollNumber();
    rollingDie.setAttribute(`src`,`${randomRoll}.png`);
    rollingInterval = setInterval(rollingDiceLoop, 70);
    let timerLength = randomRollNumber()*1000 + 1000;
    setTimeout(endRoll,timerLength);
}

let y=1;
let x=1;
let speedX = 1;
function rollingDiceLoop(){
    rollingDie = document.getElementById('rolling-Die');
    let randomRoll = randomRollNumber();
    rollingDie.setAttribute(`src`,`${randomRoll}.png`);
    rolledDie = randomRoll;
    let locationX = rollingDie.offsetLeft;
    let locationY = rollingDie.offsetTop;
    if (rollingDown){locationY += y;}
    if (!rollingDown){locationY -= y}
    y+=randomRollNumber()*speedX;
    if (locationY >= rollingBottomMax){
        locationY = rollingBottomMax;
        rollingDown = false;
        y=randomRollNumber();
        rollingTopMax = rollingTopMax + ((rollingBottomMax-rollingTopMax)/5);
    };
    if (locationY <= rollingTopMax){
        locationY = rollingTopMax;
        rollingDown = true;
        y=randomRollNumber();
    };
    if (rollingRight){locationX += x;}
    if (!rollingRight){locationX -= x}
    x+=((randomRollNumber()*.5)* speedX);
    if (locationX >= rollingRightMax){
        locationX = rollingRightMax;
        rollingRight = false;
        speedX = speedX * .75;
        x=randomRollNumber();
    };
    if (locationX <= rollingLeftMax){
        locationX = rollingLeftMax;
        rollingRight = true;
        speedX = speedX * .75;
        x=randomRollNumber();
    };
    let randomRotation = Math.floor(Math.random() * 360) + 1;
    rollingDie.style.top = `${locationY}px`;
    rollingDie.style.left =`${locationX}px`;
    rollingDie.style.transform = `rotate(${randomRotation}deg)`;
}
function endRoll(){
    console.log("end roll");
    clearInterval(rollingInterval);
    rollingDie.style.transform = `rotate(0deg)`;
    console.log("rolled Die = " + rolledDie);
    calculateRoll();
}

function randomRollNumber(){
    return Math.floor(Math.random() * 6) + 1;
}

function makeRandoColor(){
    var rc = 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
    (Math.floor((256-190)*Math.random()) + 220) + ',' + 
    (Math.floor((256-190)*Math.random()) + 200) + ')';
    return rc;
}

const bStyle = ["solid","groove","dashed","dotted","double"];
let a =0;
function winnerAni(box){
    let rand = makeRandoColor();
    box.style = `background-color:${rand}; border-style:${bStyle[a]}`;
    a ++;
    if(a>=5){a=0};
}

function logout(){
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}

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
            console.log("logged in");
        }else{
            loginBlock.style.display = "block";
        }
      });
      
}
