
const db = firebase.firestore();
const docRef = db.collection("budget").doc("fuku_moni");



const loginBlock = document.getElementById("loginBlock");
const loginButton = document.getElementById("loginButton");
const mBalance = document.getElementById("mBalance");
const yBalance = document.getElementById("yBalance");
const placeHistory = document.getElementById("history");
const historyPricesM = document.getElementById("historyPricesM");
const historyPlacesM = document.getElementById("historyPlacesM");
const historyPricesY = document.getElementById("historyPricesY");
const historyPlacesY = document.getElementById("historyPlacesY");

const transBlock = document.getElementById("inputTransactionBlock");
let transBlockVisible = false;
const whoPlaceholder = document.getElementById("whoPlaceholder");
const transPlace = document.getElementById("inputTransactionPlace");
const transPrice = document.getElementById("inputTransactionPrice");
const bottomArrow = document.getElementById("bottomArrow");

let transStringNumber = "";
let transEmoji = "";
let newAddition = "";

let mBudgetRemaining = 0;
let yBudgetRemaining = 0;


let historyLengthM = 0;
let historyPositionM = 0;
let historyLengthY = 0;
let historyPositionY = 0;

const smallSpace = `<br style='padding:12px;'> </br>`;

let price = "0";
let place = "place";

let activeAddWho = "n";

let allData = '';

document.onload = pageLoad();

function pageLoad() {
    transBlock.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          //console.log('signed in');
          loginBlock.style.display = 'none';
          docRef.onSnapshot(function(doc) {refreshPage();});
          refreshPage();
        } else {
          // No user is signed in.
          //console.log('Not signed in');
          loginBlock.style.display = 'block';
        }
      });
      
}

function refreshPage (){
    docRef.get().then(function(doc) {
        if (doc.exists) {
            allData = doc.data(); 
            loadBalances();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
    //docDate.get().then(function(doc) {
    //    if (doc.exists) {
    //        nextPayDay = doc.data(); 
    //        nextPayDay = nextPayDay.topay.toDate();
    //        checkDate();
    //    } else {
    //        console.log("No such document!");
    //    }
    //}).catch(function(error) {
    //    console.log("Error getting document:", error);
    //});;

}

function checkDate(){
    let d = new Date();
    console.log(d);
    //if(d>nextPayDay){
    //    updatePayDate();
    //}
}

function updatePayDate(){
    //nextPayDay.setDate(nextPayDay.getDate() + 14);

    //docDate.set({
    //    topay : nextPayDay
    //}, { merge: true });
    
    paydayPoutout();
}

function paydayPoutout() {
    console.log('afterpayday');
    //let balanceAdjust = (allData["balance"] + 700);
    //let newTransaction = "700, + Payday";
    //writeHistoryDB(newTransaction,balanceAdjust);
}

function loadBalances(){
    let mikeybalance = allData["mikey"];
    mBudgetRemaining = (Math.round(mikeybalance * 100) / 100).toFixed(2)
    //console.log(mBudgetRemaining);
    //mBalance.innerText = 'Mikey $' + mBudgetRemaining;
    let yokobalance = allData["yoko"];
    yBudgetRemaining = (Math.round(yokobalance * 100) / 100).toFixed(2)
    //yBalance.innerText = 'Yoko $' + (Math.round(yokobalance * 100) / 100).toFixed(2);
    historyLengthM = allData['mhistory'].length;
    historyLengthY = allData['yhistory'].length;
    historyPlacesM.innerText = '';
    historyPricesM.innerText = '';
    historyPlacesY.innerText = '';
    historyPricesY.innerText = '';
    transPrice.value = '';
    transPlace.value = '';
    historyPositionM = 0;
    historyPositionY = 0;
    let historySlotsM = 0;
    if (historyLengthM > 7){
        historySlotsM = 8;
    }else{
        historySlotsM = historyLengthM;
    }
    let historySlotsY = 0;
    if (historyLengthY > 7){
        historySlotsY = 8;
    }else{
        historySlotsY = historyLengthY;
    }
    printHistory(historySlotsM,historySlotsY);
}

function printHistory(m,y){
    let i = 0;
    while (i<m){
        let newArray = allData["mhistory"][i].split(',')
        price = newArray[0];
        place = newArray[1];
        //historyPricesM.innerText += `$${price}`;
        historyPlacesM.innerHTML += `<p>$${price} ${place}</p>`;
        //historyPlacesM.innerHTML += smallSpace;
        historyPricesM.innerHTML += smallSpace;
        mBudgetRemaining -= price;
        //console.log(mBudgetRemaining + "   price subtracted =" + price + "  place:" + place);
        i++;
        historyPositionM++;
    }
    i = 0;
    while (i<y){
        let newArray = allData["yhistory"][i].split(',')
        price = newArray[0];
        place = newArray[1];
        //historyPricesY.innerText += `$${price}`;
        historyPlacesY.innerHTML += `<p>$${price} ${place}</p>`;
        //historyPlacesY.innerHTML += smallSpace;
        historyPricesY.innerHTML += smallSpace;
        yBudgetRemaining -= price;
        i++;
        historyPositionY++;
    }

    mBalance.innerText = 'Mikey $' + mBudgetRemaining;
    yBalance.innerText = 'Yoko $' + yBudgetRemaining;

}

//function expandHistory(){
//    if (historyLengthM > 7){
//        let historyScopeM = historyLengthM + 8;
//    }else{
//        let historyScopeM = historyLengthM;
//    }
//    if (historyScopeM < historyLengthM){
//        printHistory(historyPositionM, historyScopeM);
//    }else {
//        printHistory(historyPositionM,historyLengthM);
//        bottomArrow.style.display = 'none';
//    }
//}

function clickAddM(){
    activeAddWho = "m"
    whoPlaceholder.innerText = 'mikey shop';
    if (transBlockVisible){
        transBlock.style.display = "none";
        transPrice.value = '';
        transPlace.value = '';
        transBlockVisible = false;
    }else{
    transBlock.style.display = "";
    transBlockVisible = true;
    }
}

function clickAddY(){
    activeAddWho = "y"
    whoPlaceholder.innerText = 'yoko shop';
    if (transBlockVisible){
        transBlock.style.display = "none";
        transPrice.value = '';
        transPlace.value = '';
        transBlockVisible = false;
    }else{
    transBlock.style.display = "";
    transBlockVisible = true;
    }
}

function hitX(){
    activeAddWho = '';
    if (transBlockVisible){
        transBlock.style.display = "none";
        transPrice.value = '';
        transPlace.value = '';
        transBlockVisible = false;
    }else{
    transBlock.style.display = "";
    transBlockVisible = true;
    }
}

function backspace(){
    transStringNumber = transStringNumber.slice(0,-1);
    transPrice.placeholder = transStringNumber;
}

//
//  Number buttons
//

function numPadOne(){
    console.log("hit 1");
    transStringNumber = transStringNumber + "1";
    console.log(transStringNumber, " = transStringNumber");
    transPrice.placeholder = transStringNumber;
}
function numPadTwo(){
    transStringNumber = transStringNumber + "2";
    transPrice.placeholder = transStringNumber;
}

function numPadThree(){
    transStringNumber = transStringNumber + "3";
    transPrice.placeholder = transStringNumber;
}
function numPadFour(){
    transStringNumber = transStringNumber + "4";
    transPrice.placeholder = transStringNumber;
}

function numPadFive(){
    transStringNumber = transStringNumber + "5";
    transPrice.placeholder = transStringNumber;
}

function numPadSix(){
    transStringNumber = transStringNumber + "6";
    transPrice.placeholder = transStringNumber;
}

function numPadSeven(){
    transStringNumber = transStringNumber + "7";
    transPrice.placeholder = transStringNumber;
}

function numPadEight(){
    transStringNumber = transStringNumber + "8";
    transPrice.placeholder = transStringNumber;
}

function numPadNine(){
    transStringNumber = transStringNumber + "9";
    transPrice.placeholder = transStringNumber;
}

function numPadZero(){
    transStringNumber = transStringNumber + "0";
    transPrice.placeholder = transStringNumber;
}

// Emoji Buttons

function emojiShirt(){
    transEmoji = "&#128085";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}
function emojiPants(){
    transEmoji = "&#128086";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiDress(){
    transEmoji = "&#128087";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiShoes(){
    transEmoji = "&#128095";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiSocks(){
    transEmoji = "&#129510";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiCoat(){
    transEmoji = "&#129509";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiSunglasses(){
    transEmoji = "&#128083";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiBag(){
    transEmoji = "&#128092";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function emojiBike(){
    transEmoji = "&#128692";
    transPlace.innerHTML = "<p>" + transEmoji + "</p>";
}

function transactionSubmit(){
    newAddition = transStringNumber + "," + transEmoji;

    if (activeAddWho == "m"){
        allData['mhistory'].unshift(newAddition)
        docRef.set({
        mhistory : allData['mhistory']
    }, { merge: true }
    );
    }

    if(activeAddWho == "y"){
        allData['yhistory'].unshift(newAddition)
        docRef.set({
        yhistory : allData['yhistory']
    }, { merge: true }
    );
    }

    transEmoji = '';
    transStringNumber = '';
    transPlace.innerHTML = "";
    transPrice.placeholder = transStringNumber;
    hitX();
}

//    if (n){
//        let newTransaction = transPrice.value + ", " + transPlace.value;
//        let balanceAdjust = (allData["balance"] - n);
//        let vacationBalanceAdjust = (allData["vacation"]);
//        vacationBalanceAdjust += n;
//        if (transPlace.value.split(' ')[0] == 'vacation' || transPlace.value.split(' ')[0] == 'Vacation'){
//            if (n > 0){
//                writeHistoryDBV(newTransaction,balanceAdjust, vacationBalanceAdjust);
//            } else if (n < 0){
//                balanceAdjust = (allData["balance"]);
//                writeHistoryDBV(newTransaction, balanceAdjust, vacationBalanceAdjust);
//            }
//        }else{
//            writeHistoryDB(newTransaction,balanceAdjust);
//        }
//    }else{
//        alert("Not a valid number");
//    }





//function transactionSubmitB(){
//    let n = parseFloat(transPrice.value);
//    if (n){
//        let newTransaction = transPrice.value + ", " + transPlace.value;
//        let balanceAdjust = (allData["balance"] - n);
//        let vacationBalanceAdjust = (allData["vacation"]);
//        vacationBalanceAdjust += n;
//        if (transPlace.value.split(' ')[0] == 'vacation' || transPlace.value.split(' ')[0] == 'Vacation'){
//            if (n > 0){
//                writeHistoryDBV(newTransaction,balanceAdjust, vacationBalanceAdjust);
//            } else if (n < 0){
//                balanceAdjust = (allData["balance"]);
//                writeHistoryDBV(newTransaction, balanceAdjust, vacationBalanceAdjust);
//            }
//        }else{
//            writeHistoryDB(newTransaction,balanceAdjust);
//        }
//    }else{
//        alert("Not a valid number");
//    }
//
//}
////function writeHistoryDBV_OLD(newHistory,newBalance, newVacation){
//    let newArrayHistory = allData["history"].unshift(newHistory);
//    let removdItemFromHistory = allData["history"].pop();
//    console.log(" removed item from history " + removdItemFromHistory);
//    console.log(newArrayHistory);
//    docRef.set({
//        history : allData['history'],
//        balance : newBalance,
//        vacation : newVacation
//    }, { merge: true }
//    );
//}
//
//function writeHistoryDB_OLD(newHistory,newBalance){
//    let newArrayHistory = allData["history"].unshift(newHistory);
//    let removdItemFromHistory = allData["history"].pop();
//    console.log(" removed item from history " + removdItemFromHistory);
//    console.log(newArrayHistory);
//    docRef.set({
//        history : allData['history'],
//        balance : newBalance
//    }, { merge: true }
//    );
//}


// LOGIN 

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
      
}