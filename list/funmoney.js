console.log('hello');

var db = firebase.firestore();
var docRef = db.collection("funmoney").doc("amounts");
var docHistory = db.collection("funmoney").doc("history");

let mikeyMoney = 0;
var mikeyHistory = null;
let yokoMoney = 0;
let yokoHistory = null;
let mikeySelected = false;

let mikeyBalanceLocation = document.getElementById('mikeyBalance');
let yokoBalanceLocation = document.getElementById('yokoBalance');

let funMoneyData = '';
let allAccounts = '';
let historyAll = '';

const balanceInput = document.getElementById('inputBlock');
const mPlus = document.getElementById('mikeyPlus');
const yPlus = document.getElementById('yokoPlus');
const plusButton = document.getElementById('plusButton');
const mTitle = document.getElementById('mTitle');
const yTitle = document.getElementById('yTitle');
const balanceBar = document.getElementById('balanceBar');
const mBlock = document.getElementById('mHistory');
const yBlock = document.getElementById('yHistory');

const unselectedTitleBorder = `border-color: cornsilk; border-bottom-color: dimgrey;`;

const smallSpace = `<div style='padding:2px;'></div>`

const loginButton = document.getElementById('loginButton');
const loginBlock = document.getElementById('login');

document.onload =pageLoad();

function pageLoad() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          //console.log('signed in');
          loginBlock.style.display = 'none';
          docHistory.onSnapshot(function(doc) {refreshPage();});
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
            funMoneyData = doc.data();
            allAccounts = Object.keys(funMoneyData);   
            loadBalances();
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
      getHistory();
}

function getHistory(){
    docHistory.get().then(function(doc) {
        if (doc.exists) {
            historyAll = doc.data();
            //allAccounts = Object.keys(funMoneyData);
            //allLists = Object.keys(allData);
            //console.log(allLists);     
            printHistory();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });;
}

function printHistory(){
    mikeyHistory = historyAll["mikey"].split(',');
    yokoHistory= historyAll["yoko"].split(',');
    console.log(mikeyHistory + `  ` + yokoHistory);
    let i = 0;
    let mBal = mikeyMoney;
    let yBal = yokoMoney;
    mBlock.innerHTML = "";
    yBlock.innerHTML = "";
    let newBalanceItem = "";
    let yNo = '';
    let lNo = '';
    while (i < 4) {
        // Add each row of history 
        mBal -= mikeyHistory[i];
        newBalanceItem = ` . <div class='balance-item' style="display:in-line block;"> ${mBal} </div>`;
        mBlock.insertAdjacentHTML("beforeend",newBalanceItem);
        lNo = mikeyHistory[i];
        if (lNo < 0){
            lNo = Math.abs(lNo);
            newAdjustItem = ` - <div class='minus-item' style=" display:in-line block;"> ${lNo} </div>`;
        }else{
            newAdjustItem = ` + <div class='plus-item' style="display:in-line block;"> ${lNo} </div>`;
        };
        mBlock.insertAdjacentHTML("beforeend",newAdjustItem + smallSpace);
        yBal -= yokoHistory[i];
        newBalanceItem = ` . <div class='balance-item' style="display:in-line block;"> ${yBal} </div>`;
        yBlock.insertAdjacentHTML("beforeend",newBalanceItem);
        yNo = yokoHistory[i];
        if (yNo < 0){
            yNo = Math.abs(yNo);
            newAdjustItem = ` - <div class='minus-item' style="display:in-line block;"> ${yNo} </div>`;
        }else{
            newAdjustItem = ` + <div class='plus-item' style="display:in-line block;"> ${yNo} </div>`;
        };
        yBlock.insertAdjacentHTML("beforeend",newAdjustItem + smallSpace);
        i++;
    }

}

function loadBalances(){
    mikeyMoney = funMoneyData.mikey;
    yokoMoney = funMoneyData.yoko;
    //console.log(allAccounts);
    mikeyBalanceLocation.innerText = mikeyMoney;
    yokoBalanceLocation.innerText = yokoMoney;
}

// Add or Subtract from balance

function addMoneyMikey(){
    mTitle.style.border = 'solid';
    mikeySelected = true;
    addMoney();
}

function addMoneyYoko(){
    yTitle.style.border = 'solid';
    mikeySelected = false;
    addMoney();
}

function addMoney(){
    inputBlock.style.display = 'block';
    mPlus.style.display = 'none';
    yPlus.style.display = 'none';
}

plusButton.addEventListener("click",addToBalance);
balanceInput.addEventListener("keydown", function(event) {
    if(event.key == 'Enter'){
        plusButton.click();
    }
  }, true);


function addToBalance(){
    if (balanceBar.value){
        if (mikeySelected){
            updateBalances("mikey",balanceBar.value);
        } else {
            updateBalances("yoko",balanceBar.value);
        }
    }
}

function updateBalances(name, amount){
    //console.log("name: " + name + " plus " + amount);
    let junk = '';
    amount = parseInt(amount);
    if (mikeySelected){
        mikeyMoney = parseInt(mikeyMoney);
        mikeyMoney = mikeyMoney + amount;
        junk  = mikeyHistory.unshift(amount);
        junk = mikeyHistory.pop();
        console.log(mikeyHistory);
        let toAppend = mikeyHistory.toString();
        docHistory.set({
            mikey : toAppend
        }, { merge: true });
        docRef.set({
            mikey : mikeyMoney
        }, { merge: true });
    }else{
        yokoMoney = parseInt(yokoMoney);
        yokoMoney = yokoMoney + amount;
        junk  = yokoHistory.unshift(amount);
        junk = yokoHistory.pop();
        console.log(yokoHistory);
        let toAppend = yokoHistory.toString();
        docHistory.set({
            yoko : toAppend
        }, { merge: true });
        docRef.set({
           yoko : yokoMoney
        }, { merge: true });
    };
    cancelAdd();

}

function cancelAdd(){
    balanceBar.value = '';
    //console.log(funMoneyData[name]);
    mikeySelected = false;
    mTitle.style = unselectedTitleBorder;
    yTitle.style = unselectedTitleBorder;
    inputBlock.style.display = 'none';
    mPlus.style.display = 'initial';
    yPlus.style.display = 'initial';
}


// Login 

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

// Dev Testing

let devButton = document.getElementById('devButton');
devButton.remove();
// function devButtonClick(){
// // var setWithMerge = db.collection("funmoney").doc("amounts").set({
// //     Bogo: 188
// // }, { merge: true });

//     loadBalances();
// }