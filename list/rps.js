const db = firebase.firestore();
const docRPS = db.collection("rps").doc("bet");
const docFM = db.collection("funmoney").doc("amounts");
const docFMH = db.collection("funmoney").doc("history");

const loginBlock = document.getElementById("login-block");
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener("click",login);

let funMoneyData = null;
let mikeyMoney = null;
let yokoMoney = null;
let historyAll = null;

let allRPSData = [];
let playerName = '';
let otherPlayer = '';

let betInitiated = false;
let betInitiator = "";
let betAmount = 0;
let betAccepted = false;

let playerM = 'null';
let playerY = 'null';
let onePersonWho = 'null';
let onePersonPlayed = false;
let historyWho = '';
let historyAmount = 0;
let historyM = '';
let historyY = '';

const mainGrid = document.getElementById('main-grid');
const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');
const leftBottom = document.getElementById("left-bottom");
const rightBottom = document.getElementById("right-bottom");
const leftBottomB = document.getElementById("left-bottomB");
const rightBottomB = document.getElementById("right-bottomB");
const mainArea = document.getElementById("main-area");
const historyBlock = document.getElementById("historyBlock");
const historyBottom = document.getElementById("history-bottom");
const wideRow = document.getElementById('wide-row');

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
                playerName = "mikey"; otherPlayer = 'yoko';
            }
            if (userEmail == "yoko@boogle.com" || userEmail == "pogo@boogle.com"|| userEmail =="y@boogle.com"){
                playerName = "yoko"; otherPlayer = 'mikey';
            }
            docRPS.onSnapshot(function(doc) {
                refreshPage();
            });
        } else {
            loginBlock.style.display = 'block';
            console.log('not logged in');
        }
      });

}

function refreshPage(){
    docRPS.get().then(function(doc) {
        if (doc.exists) {
            loadFunMoney();
            allRPSData = doc.data();
            betInitiated = allRPSData.betInitiated;
            betInitiator = allRPSData.betInitiator;
            betAmount = allRPSData.betAmount;
            betAccepted = allRPSData.betAccepted;
            playerY = allRPSData.playerY;
            playerM = allRPSData.playerM;
            onePersonPlayed = allRPSData.onePersonPlayed;
            onePersonWho = allRPSData.onePersonWho;
            historyWho = allRPSData.historyWho;
            historyAmount = allRPSData.historyAmount;
            historyY = allRPSData.historyY;
            historyM = allRPSData.historyM;
            historyBottom.innerHTML = `Previous Win: ${historyWho}, $ ${historyAmount}`;
            leftBottomB.style = "border: none;";
            rightBottomB.style = "border: none;";
            rightBottomB.innerHTML = `<img height='34px' src='${historyY}.png'>`;
            leftBottomB.innerHTML = `<img height='34px' src='${historyM}.png'>`;
            if (playerName == "yoko" && allRPSData.alertY){
                alertPastWin("yoko");
            }else if (playerName == "mikey" && allRPSData.alertM){
                alertPastWin("mikey");
            }
            if (playerM != 'null' && playerY != 'null'){console.log("both submitted")}
            if(onePersonPlayed){
                    if (onePersonWho == playerName){awaitingPlay();}
                    else{requestPlay()};
            }else{
            if (betAccepted){
                    historyBlock.innerHTML = `Bet initiated by ${betInitiator} for $${betAmount}.`;

                    if (playerName == 'mikey'){
                        if (playerM == 'null'){
                            requestPlay()
                        }else{awaitingPlay()};
                     };
                     if (playerName == 'yoko'){
                        if (playerY == 'null'){
                            requestPlay()
                        }else{awaitingPlay()};
                     };

                }else{
                    if (betInitiated){
                    historyBlock.innerHTML = `Bet initiated by ${betInitiator} for $${betAmount}.`;
                        if (playerName == betInitiator){
                        printInitiatedBet(betAmount);
                        }else{
                        printAcceptBet(betAmount);
                        }
                }else{
                    historyBlock.innerHTML = `No bet initiated.`;
                    let textBlock = `<a onclick='initiate()'><div style="text-align: center; border-style: solid;
                    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
                    width: 33%; left: 33%;"><br>
                    ${playerName}<br><img src="rpsblank.png"></img><br>Initiate a Bet</div></a>`;
                    mainArea.innerHTML = textBlock;
                    }
                }
            }

        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
}
function clearAlert(whoClear){
    document.getElementById("alert-box").remove();
    if (whoClear == "mikey"){
        docRPS.set({
            alertM : false
        }, { merge: true });
    }
    if (whoClear == "yoko"){
        docRPS.set({
            alertY : false
        }, { merge: true });
    }
}

function alertPastWin(person){
    let textBlip = document.createElement("html");
    textBlip.innerHTML = `<div id="alert-box" style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width:90%; height: 80%; left : 5%; top : 10%; z-index : 100;"><br>
    <a onclick='clearAlert("${person}")'><img src="x.png"></img>
    <br><br><br>
    previous win : ${historyWho} <br><br> $${historyAmount}</a>
    <br><br>
    <img src='${historyM}.png'><img src='empty.png'><img src='empty.png'><img src='${historyY}.png'>
    <br>
    mikey<img src='empty.png'><img src='empty.png'><img src='empty.png'>yoko
    </div>`;
    mainGrid.insertAdjacentElement("afterbegin", textBlip);
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
            leftBottom.innerHTML = `Mikey:$${mikeyMoney}`;
            rightBottom.innerHTML = `Yoko:$${yokoMoney}`;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
}

function initiate(){
    mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
            border-color:white; background-color: rgb(199, 196, 189); position:absolute;
            width: 33%; left: 33%; z-index: 5;"><input type="text" size='10' placeholder="amount" id="input-bet"
            style="height:30px; background-color: lightgrey;">
            <br><a onclick='initiateBet()'><img src="rpsempty.png"></img><br>Initiate Bet</a></div>`;
}

function initiateBet(){
    betAmount = document.getElementById("input-bet").value;
    if (!isNaN(betAmount)){
        mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
        border-color:white; background-color: rgb(199, 196, 189); position:absolute;
        width: 80%; left: 10%; z-index: 5; height: 140px;">
        <br> saving bet </div>`;
        docRPS.set({
            betAmount : betAmount,
            betInitiator : playerName,
            betInitiated : true,
        }, { merge: true });
        printInitiatedBet(betAmount);
    } else {
        refreshPage();
    }

}

function printInitiatedBet(betValue){
    mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 80%; left: 10%; z-index: 5; height: 140px;">
    <br><a onclick='cancelBet()'><img src="x.png"></img> cancel $${betValue} bet</a><br><br> You have initiated a bet.
    <br> waiting for bet to be accepted.</div>`;
}

function cancelBet(){
    //write no bet to database
    docRPS.set({
        betAmount : 0,
        betInitiator : 'null',
        betInitiated : false
    }, { merge: true });
}

function printAcceptBet(betValue){
    mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 80%; left: 10%; z-index: 5; height: 140px;"> ${otherPlayer} has offered a $${betValue} bet 
    <br><br><a onclick='cancelBet()'><img src="x.png"></img> decline </a><br>
    <br><a onclick='acceptBet()'><img src="plus.png"></img> accept </a><br>
    </div>`;
}

function acceptBet(){
    docRPS.set({
        betAccepted : true,
        playerM : 'null',
        playerY : 'null',
        onePersonPlayed: false,
        onePersonWho: 'null'
    }, { merge: true });
}

function requestPlay(){
    // ask r,p,s from player, write to db
    wideRow.innerHTML = '<div style="text-align: center;">good luck</div>';
    if (onePersonPlayed){wideRow.innerHTML = `<div style="text-align: center;">good luck, ${otherPlayer} awaits</div>`};
    mainArea.innerHTML = `<br><div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 80%; padding: 12px; left: 5%; z-index: 5; height: 140px;"> $${betAmount} bet 
    <br><a onclick='selectRPS("rock")'><img src="rock.png"></img></a>
    <a onclick='selectRPS("paper")'><img src="paper.png"></img></a> 
    <a onclick='selectRPS("scissors")'><img src="scissors.png"></img></a> 
    </div>`;
}
function awaitingPlay(){
    mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 80%; left: 10%; z-index: 5; height: 140px;">waiting for ${otherPlayer} to play<br>
    </div>`;
}

function selectRPS(word){
    mainArea.innerHTML = `<div style="text-align: center; border-style: solid;
    border-color:white; background-color: rgb(199, 196, 189); position:absolute;
    width: 80%; left: 10%; z-index: 5; height: 140px;"> $${betAmount} bet 
    <br><a onclick='confirmRPS("${word}")'><img src="${word}.png"></img> Confirm</a>
    <br>
    <br>
    <a onclick='requestPlay()'><img src="x.png">Cancel</img></a> 
    </div>`;
}

function confirmRPS(word){
    console.log("confirmRPS line 274")
    if (onePersonPlayed == true){
        secondPlayRPS(word);
    }else{
    if (playerName == 'mikey' && playerY == 'null'){
        firstPlayRPS(word);
        }
    if (playerName == 'yoko' && playerM == 'null'){
        firstPlayRPS(word);
        }
    }
}

function firstPlayRPS(word){
    word = word.toString();
    console.log("first play word: " + word);
    if (playerName == 'mikey'){
        playerM == word;
        docRPS.set({
            onePersonWho : playerName,
            onePersonPlayed : true,
            playerM : word
        }, { merge: true });
        }
    if (playerName == 'yoko'){
        playerY == word;
        docRPS.set({    
            onePersonWho : playerName,
            onePersonPlayed : true,
            playerY : word
        }, { merge: true });
        }
}

function secondPlayRPS(word){
    word = word.toString();
    console.log("second play word: " + word);
    if (playerName == 'mikey'){
        playerM = word;
        };
    if (playerName == 'yoko'){
        playerY = word;
        };
    if (playerY == playerM){
        tieRPS();
    }else{
        let result = notTieRPS(playerM, playerY);
        if (result == playerM){
            computeWinnings("mikey");
        } else if (result == playerY){
            computeWinnings("yoko");
        } else{alert("error line 319")};
    }

};

function tieRPS(){
    console.log("write tie to db")
    docRPS.set({
        historyWho : "tie",
        historyM : playerM,
        historyY : playerY,
        historyAmount : betAmount,
        onePersonWho : 'null',
        onePersonPlayed : false,
        playerY : 'null',
        playerM : 'null',
        betInitiated : false,
        betInitiator : 'null',
        betAmount : 0,
        betAccepted : false,
        alertM : true,
        alertY : true
    }, { merge: true });
    
}

function notTieRPS(p1,p2){
    console.log("p1 = " + p1 + "    p2 = " + p2);
    if(p1 == "rock"){
        if (p2 == "scissors"){
            return p1;
        } else if (p2 == "paper") {return p2};
    }
    if(p2 == "rock"){
        if (p1 == "scissors"){
            return p2;
        } else if (p1 == "paper") {return p1};
    }
    if (p1 == "scissors"){
        if (p2 == "paper"){return p1}
    }
    if (p2 == "scissors"){
        if (p1 == "paper"){return p2}
    }

};


function computeWinnings(who){
    console.log(`${who}wins`);
    docRPS.set({
        historyWho : who,
        historyM : playerM,
        historyY : playerY,
        historyAmount : betAmount,
        onePersonWho : 'null',
        onePersonPlayed : false,
        playerY : 'null',
        playerM : 'null',
        betInitiated : false,
        betInitiator : 'null',
        betAmount : 0,
        betAccepted : false,
        alertM : true,
        alertY : true
    }, { merge: true }
    );
     writeToFunmoneyDatabase(who, betAmount);
};



    // writeToFunmoneyDatabase("mikey",.25);
    // writeToFunmoneyDatabase("yoko",.25);

////////////  Write Money to fun money Database

function writeToFunmoneyDatabase(who,amount){
    let junk = '';
    let junkB = '';
    let lostAmount = amount * -1;
    mikeyHistory = historyAll["mikey"].split(',');
    yokoHistory= historyAll["yoko"].split(',');
    amount = parseFloat(amount);
    lostAmount = parseFloat(lostAmount);
    if (who == "mikey"){
        // add money to mikey
        mikeyMoney = mikeyMoney * 1;
        mikeyMoney += amount;
        let newBal = (mikeyMoney.toFixed(2)).toString();
        junk = mikeyHistory.unshift(amount.toString());
        junk = mikeyHistory.pop();
        let toAppend = mikeyHistory.toString();
        // minus money yoko
        yokoMoney = yokoMoney * 1;
        yokoMoney += lostAmount;
        let newBalY = (yokoMoney.toFixed(2)).toString();
        junkB = yokoHistory.unshift(lostAmount.toString());
        junkB = yokoHistory.pop();
        let toAppendY = yokoHistory.toString();
        // write db
        docFMH.set({
            yoko : toAppendY,
            mikey : toAppend
        }, { merge: true });
        docFM.set({
            yoko : newBalY,
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
        // mikey minus loss
        mikeyMoney = mikeyMoney * 1;
        mikeyMoney += lostAmount;
        let newBalM = (mikeyMoney.toFixed(2)).toString();
        junkB = mikeyHistory.unshift(lostAmount.toString());
        junkB = mikeyHistory.pop();
        let toAppendM = mikeyHistory.toString();
        // write db
        docFMH.set({
            yoko : toAppend,
            mikey : toAppendM
        }, { merge: true });
        docFM.set({
            yoko : newBal,
            mikey : newBalM
        }, { merge: true });
    }
    // console.log(amount);
}







/////
//////    Style and Login/out
/////

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
