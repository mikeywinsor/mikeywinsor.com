const db = firebase.firestore();
const docB = db.collection("c").doc("b");

const loginBlock = document.getElementById('login');
const loginButton = document.getElementById('loginButton');
const inputBlock = document.getElementById('input-box');
const topDiv = document.getElementById('top');
let inputField = document.getElementById('input-field');


let userIsMikey = false;
let userEmail = "";

let allData = [];
let mikeyList = [];
let yokoList = [];

let currentName = '';
let canUndo = false;
let undoList = [];
let undoWho = '';

// page Load
document.onload =pageLoad();
function pageLoad(){
    inputBlock.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
            userEmail = user.email;
            if (userEmail == "mikeywinsor@gmail.com" || userEmail == "bogo@boogle.com" || userEmail == "chicago@boogle.com"){
                userIsMikey = true;
            }
            docB.onSnapshot(function(doc) {
                refreshList();
            });
        } else {
            console.log('not logged in');
        }
      });

}

function refreshList(){
    docB.get().then(function(doc) {
        if (doc.exists) {
        allData = doc.data();
        mikeyList = allData.m;
        yokoList = allData.y;
        printList();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function printList(){
    // clear old list
    topDiv.innerText = ``;
    closeInput();
    let fillHTML = "";
    if (userIsMikey){
        printOut("mikey",mikeyList,mikeyList.length);
        printOut("yoko",yokoList,yokoList.length);
    }else{
        printOut("yoko",yokoList,yokoList.length);
        printOut("mikey",mikeyList,mikeyList.length);
    }
    if(canUndo){
    fillHTML =  `<img onclick="clickUndo()" style="float:left; display: inline-block" src='undo.png'> UNDO (-) ${undoWho}
    <img onclick="clickCloseUndo()" style="float:left; display: inline-block" src='delete.png'>`;
    let newName = document.createElement('div');
    newName.innerHTML = fillHTML;
    newName.setAttribute('class', 'undo-box');
    newName.setAttribute('id', `undo`);
    topDiv.appendChild(newName);
    }
}
function printOut(user,list,n){
    let balance = list[0];  
    let i = 0;
    while (i < n){
        if(list[i+1]){
            balance = balance - list[i+1];
            balance = formatMoney(balance);
        }
        i++;
    }
    fillHTML =  `${user} : ${balance}
        <img onclick="add('${user}')" style="float:right; display: inline-block" src='minus.png'>`;
    let newName = document.createElement('div');
    newName.innerHTML = fillHTML;
    newName.setAttribute('class', 'name-box');
    newName.setAttribute('id', `${n}`);
    topDiv.appendChild(newName);
    i = 1;
    while (i < n){
        if(list[i]){
            fillHTML =  `- ${list[i]}`;
        let newName = document.createElement('div');
        newName.innerHTML = fillHTML;
        newName.setAttribute('class', 'item-box');
        topDiv.appendChild(newName);
        }
        i++;
    }
}


function closeInput(){
    inputBlock.style.display = 'none';
}

function add(name){
    inputBlock.style.display = 'block';
    let iT = document.getElementById('input-text');
    var newE = document.createElement('div');
    newE.innerHTML = `<div>minus from ${name}</div>`;
    iT.innerHTML = '';
    iT.appendChild(newE);
    inputField.value = null;
    currentName = name;
}

function pressMinus(){
    let n = parseFloat(inputField.value);
    if(n){
        n = parseFloat(formatMoney(n));
        let listCurrent = [];
        if (currentName == "mikey")
        {   
            undoList = mikeyList.slice(0)
            mikeyList.push(n);
            listCurrent = mikeyList.slice(0);
        }else{
            undoList = yokoList.slice(0)
            yokoList.push(n);
            listCurrent = yokoList.slice(0);
        }
        console.log(listCurrent);
        undoWho = currentName;
        canUndo = true;
        appendDB(currentName,listCurrent);
        inputField.value = null;
        inputBlock.style.display = 'none';
    }

}

function clickUndo(){
    canUndo = false;
    appendDB(undoWho,undoList);
}

function clickCloseUndo(){
    canUndo = false;
    refreshList();
}

function appendDB(who, list){
    if (who == "mikey"){
        docB.set({
            m : list
        }, { merge: true });
    }else if (who == "yoko"){
        docB.set({
            y : list
        }, { merge: true });
    }
}

function formatMoney(amount){
    return (Math.round(amount * 100) / 100).toFixed(2);
}


//
//
// Login 
//
//

function displayLogin(){
    loginBlock.style.display = 'block';
    loginButton.addEventListener("click",login);
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
            ;
        } 
      });
      
}