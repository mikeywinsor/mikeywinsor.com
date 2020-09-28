
const db = firebase.firestore();
const docRef = db.collection("budget").doc("balances");
const docDate = db.collection("budget").doc("nextpayday");

let nextPayDay = '';
let futurePayDay = '';

const loginBlock = document.getElementById("loginBlock");
const loginButton = document.getElementById("loginButton");
const budgetBalance = document.getElementById("budgetBalance");
const placeHistory = document.getElementById("history");
const historyPrices = document.getElementById("historyPrices");
const historyPlaces = document.getElementById("historyPlaces");
const transBlock = document.getElementById("inputTransactionBlock");
let transBlockVisible = false;
const transPlace = document.getElementById("inputTransactionPlace");
const transPrice = document.getElementById("inputTransactionPrice");
const bottomArrow = document.getElementById("bottomArrow");

let historyLength = 0;
let historyPosition = 0;

const smallSpace = `<br style='padding:12px;'> </br>`;

let price = "0";
let place = "place";


let allData = '';

document.onload =pageLoad();

function pageLoad() {

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
            historyLength = allData['history'].length;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
    docDate.get().then(function(doc) {
        if (doc.exists) {
            nextPayDay = doc.data(); 
            nextPayDay = nextPayDay.topay.toDate();
            checkDate();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;

}

function checkDate(){
    console.log(nextPayDay);
    let d = new Date();
    console.log(d);
    let numWeeks = 2;
    let newDate = nextPayDay;
    now.setDate(nextPayDay + numWeeks * 7);
    console.log(newDate)

    if(d>nextPayDay){
        updatePayDate();
    }
}

function updatePayDate(){
    nextPayDay.setDate(nextPayDay.getDate() + 14);

    docDate.set({
        topay : nextPayDay
    }, { merge: true });
    
    paydayPoutout();
}

function paydayPoutout() {
    console.log('afterpayday');
    let balanceAdjust = (allData["balance"] + 700);
    let newTransaction = "700, + Payday";
    writeHistoryDB(newTransaction,balanceAdjust);
}

function loadBalances(){
    let num = allData["balance"];
    budgetBalance.innerText = '$' + (Math.round(num * 100) / 100).toFixed(2);
    historyPlaces.innerText = '';
    historyPrices.innerText = '';
    transPrice.value = '';
    transPlace.value = '';
    let i = 0;
    historyPosition = 0;
    printHistory(i,8);
}

function printHistory(i,l){
    while (i<l){
        let newArray = allData["history"][i].split(',')
        price = newArray[0];
        place = newArray[1];
        historyPrices.innerText += `$${price}`;
        historyPlaces.innerText += `${place}`;
        historyPlaces.innerHTML += smallSpace;
        historyPrices.innerHTML += smallSpace;
        i++;
        historyPosition++;
    }
}

function expandHistory(){
    let historyScope = historyPosition + 8;
    if (historyScope < historyLength){
        printHistory(historyPosition, historyScope);
    }else {
        printHistory(historyPosition,historyLength);
        bottomArrow.style.display = 'none';
    }
}

function clickAdd(){
    if (transBlockVisible){
        transBlock.style.display = "none";
        transPrice.value = '';
        transPlace.value = '';
        transBlockVisible = false;
    }else{
    transBlock.style.display = "block";
    transBlockVisible = true;
    }
}

function transactionSubmit(){
    let newTransaction = transPrice.value + ", " + transPlace.value;
    console.log(newTransaction);
    let balanceAdjust = (allData["balance"] - transPrice.value);
    writeHistoryDB(newTransaction,balanceAdjust);
}

function writeHistoryDB(newHistory,newBalance){
    let newArrayHistory = allData["history"].unshift(newHistory);
    console.log(newArrayHistory);
    docRef.set({
        history : allData['history']
    }, { merge: true });
    docRef.set({
        balance : newBalance
    }, { merge: true }
    );
}




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