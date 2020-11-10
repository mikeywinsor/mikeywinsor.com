const db = firebase.firestore();
const docL = db.collection("l3").doc("listComplete");

const loginBlock = document.getElementById('login');
const loginButton = document.getElementById('loginButton');
const topDiv = document.getElementById('top');
const inputBlock = document.getElementById('input-box');
let inputField = document.getElementById('input-field');

const smallSpace = `<div style='padding:5px;'></div>`

let hasntPrinted = true;
let allData = [];
let masterList = [];
let listLength = 0;
let listNames = [];
let numberOfLists = 0;
let listsComplete = [];
let simpleList = [];
let userEmail = "";
let userExpanded = [];
let userIsMikey = false;

let undoString = "";
let undoList = [];
let canUndo = false;


// page Load
document.onload =pageLoad();
function pageLoad(){
    inputBlock.style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
            if (userEmail == "mikeywinsor@gmail.com" || userEmail == "bogo@boogle.com" || userEmail == "chicago@boogle.com"){
                userExpanded = allData.m;
                userIsMikey = true;
            } else if (userEmail == "yoko@boogle.com" || userEmail == "yokotesting@boogle.com" ){
                userExpanded = allData.y;
            }
            docL.onSnapshot(function(doc) {
                refreshList();
            });
        } else {
            console.log('not logged in');
            displayLogin();
        }
        userEmail = user.email;
      });
      hasntPrinted = true;
      docL.get().then(function(doc) {
          if (doc.exists) {

          refreshList();
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          }).catch(function(error) {
          console.log("Error getting document:", error);
      });

}


// RefreshList

function refreshList(){
    docL.get().then(function(doc) {
        if (doc.exists) {
        allData = doc.data();
        masterList = allData.list;
        listLength = masterList.length;
        if(userIsMikey){userExpanded = allData.m};
        if(!userIsMikey){userExpanded = allData.y};
        printList();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

// Refresh Page / Print Names, Titles, Items

function printList(){
    // clear old list
    topDiv.innerText = ``;
    closeInput();
    // Print Undo if available. 
    if(canUndo){
        let undoHTML = `<img class='plus-border' onclick="undoDelete()" src='undo.png'> Undo delete ${undoString}`;
        let undoDiv = document.createElement('div');
        undoDiv.innerHTML = undoHTML;
        undoDiv.setAttribute('class', 'undo-box');
        undoDiv.setAttribute('id', 'undo-block');
        topDiv.appendChild(undoDiv);
    }
    /// List, Titles, Items
    let i = 0;
    let currentType = "n";
    let fillHTML = "";
    let nameNumber = 0;
    let isExpanded = true;
    while (i<listLength){
        currentType = masterList[i];
        i++;
        if (currentType == "n"){
            isExpanded = userExpanded[nameNumber];
            if (isExpanded){
                fillHTML =  `<img  onclick="collapseList('${nameNumber}')" style="float:left ;display: inline-block" src='up.png'>
                ${masterList[i]}
                <img onclick="clickAddTitle('${i}')" style="float:right; display: inline-block" src='plus.png'>`;
            }else{
                fillHTML = `<img  onclick="expandList('${nameNumber}')" style="float:left ;display: inline-block" src='down.png'>
                ${masterList[i]}
                <img onclick="clickAddTitle('${i}')" style="float:right; display: inline-block" src='plus.png'>`;
            }
            let newName = document.createElement('div');
            newName.innerHTML = fillHTML;
            newName.setAttribute('class', 'name-box');
            newName.setAttribute('id', `${i}`);
            topDiv.appendChild(newName);
            let newDeleteHTML = `<img onclick="deleteName('${i}')" src='delete.png'>`;
            let newDelete = document.createElement('div');
            newDelete.innerHTML = newDeleteHTML;
            newDelete.setAttribute('class','item-delete');
            if (masterList[i+1]=="n" || masterList[i+1]== null){
                topDiv.appendChild(newDelete);
            }
            nameNumber ++;
        }
        if (currentType == "t" && isExpanded){
            let titleHTML = `${masterList[i]}<img style="float:right; display: inline-block" 
            onclick="clickAddItem(${i})" src='plusw.png'>`;
            let newTitle = document.createElement('div');
            newTitle.innerHTML = titleHTML;
            newTitle.setAttribute('class', 'title-box');
            newTitle.setAttribute('id', `${i}`);           
            let newDeleteHTML = `<img onclick="removeTitle('${i}')" src='delete.png'>`;
            let newDelete = document.createElement('div');
            newDelete.innerHTML = newDeleteHTML;
            newDelete.setAttribute('class','item-delete');
            topDiv.appendChild(newTitle);
            if(masterList[i+2]=="empty"){topDiv.appendChild(newDelete)};
        }
        if (currentType == "i" && isExpanded){
                let newItem = document.createElement('div');
                let itemHTML = `${masterList[i]}`;
                newItem.innerHTML = itemHTML;
                newItem.setAttribute('class', 'item-box');
                newItem.setAttribute('id', `${i}`);
                if (masterList[i] == "empty"){itemHTML = "empty";newItem.setAttribute('class', 'empty-item');};
                let newDeleteHTML = `<img onclick="removeItem('${i}')" src='delete.png'>`;
                let newDelete = document.createElement('div');
                newDelete.innerHTML = newDeleteHTML;
                newDelete.setAttribute('class','item-delete');
                topDiv.appendChild(newItem);
                if(masterList[i] !== "empty"){topDiv.appendChild(newDelete);}
        };
        i++;
    }
    fillHTML =  `<img onclick="clickAddName()" style="float:center; display: inline-block; " src='plus.png'> new list`;
    let newName = document.createElement('div');
    newName.innerHTML = fillHTML;
    newName.setAttribute('class', 'plus-bottom');
    newName.setAttribute('id', `${i}`);
    topDiv.appendChild(newName);
        
}

// REMOVE ITEM

function removeItem(n){
    document.getElementById(`${n}`).style.background = "rgb(170, 92, 92)";
    undoList = masterList.slice(0);
    undoString = masterList[n];
    canUndo = true;
    let nM = parseInt(n-1);
    // check if only item then set to empty
    if (masterList[nM+2]=="i" || masterList[nM-2]=="i")
    {
        masterList.splice(nM, 2);
    }else{
        masterList[n] = "empty";
    }
    updateDB();
}

function updateDB(){
    docL.set({
        list : masterList
    }, { merge: true });
}
function updateCollapse(){
    if(userIsMikey){
        docL.set({
            m : userExpanded
        }, { merge: true });
    }else{
        docL.set({
            y : userExpanded
        }, { merge: true });
    }
}

function undoDelete(){
    canUndo = false;
    document.getElementById("undo-block").style.backgroundColor = "darkgrey";
    docL.set({
        list : undoList
    }, { merge: true });
}

/////////
////////    Remove a Title and Empty
/////////

function removeTitle(n){
    document.getElementById(`${n}`).style.background = "rgb(170, 92, 92)";
    undoList = masterList.slice(0);
    undoString = masterList[n];
    canUndo = true;
    masterList.splice(n-1,4);
    updateDB();
}


// Create a Whole New List

function clickAddName(){
    inputBlock.style.display = 'block';
    let blurp = "Create a New List";
    inputBlock.innerHTML = `<div style='display: flex; float: right;' onclick="closeInput()">
    <img src='delete.png'></div>
    </br></br><input type="text" size='20' placeholder="List Name..." id="input-field"
        style="height:30px; background-color: lightgrey;"></br></br>
    <div class='plus-border' style='display: inline-block;'>
    <img src='plusw.png' onclick="createNewList()" ></div>`;
    inputBlock.insertAdjacentText("afterbegin",blurp);
    inputField = document.getElementById('input-field');
    inputField.addEventListener("keydown", function(event) {
        if(event.key == 'Enter'){
            createNewList();
        }
      }, true);

}
function createNewList(){
    let inputValue = inputField.value;
    if (inputValue){
        canUndo = false;
        inputField.value = null;
        inputBlock.style.backgroundColor = "rgba(24, 24, 24, 0.6)";        
        masterList.push("n");
        masterList.push(inputValue);
        userExpanded.push(true);
        updateCollapse();
        updateDB();
    }
}

//////
/////  Remove List 
//////

function deleteName(n){
    undoList = masterList.slice(0);
    undoString = masterList[n];
    canUndo = true;
    n--;
    masterList.splice(n,2);
    updateDB();
}


////////
///////     Add a title, with an empty item
////////

function clickAddTitle(n){
    inputBlock.style.display = 'block';
    let blurp = "Add to " + masterList[n];
    inputBlock.innerHTML = `<div style='display: flex; float: right;' onclick="closeInput()">
    <img src='delete.png'></div>
    </br></br><input type="text" size='20' placeholder="" id="input-field"
        style="height:30px; background-color: lightgrey;"></br></br>
    <div class='plus-border' style='display: inline-block;'>
    <img src='plusw.png' onclick="addTitleSubmit(${n})" ></div>`;
    inputBlock.insertAdjacentText("afterbegin",blurp);
    inputField = document.getElementById('input-field');
    inputField.addEventListener("keydown", function(event) {
        if(event.key == 'Enter'){
            addTitleSubmit(n);
        }
      }, true);
}

function addTitleSubmit(n){
    let inputValue = inputField.value;
    if (inputValue){
        canUndo = false;
        inputField.value = null;
        inputBlock.style.backgroundColor = "rgba(24, 24, 24, 0.6)";
        n++;        
        masterList.splice(n,0,"t");
        n++;    
        masterList.splice(n,0,inputValue);
        n++;    
        masterList.splice(n,0,"i");
        n++;    
        masterList.splice(n,0,"empty");
        updateDB();
    }
}

/////
//// ADD an ITEM to a List
/////

function clickAddItem(n){
    inputBlock.style.display = 'block';
    let blurp = "Add to " + masterList[n];
    inputBlock.innerHTML = `<div style='display: flex; float: right;' onclick="closeInput()">
    <img src='delete.png'></div>
    </br></br><input type="text" size='20' placeholder="" id="input-field"
        style="height:30px; background-color: lightgrey;"></br></br>
    <div class='plus-border' style='display: inline-block;'>
    <img src='plusw.png' onclick="addItemSubmit(${n})" ></div>`;
    inputBlock.insertAdjacentText("afterbegin",blurp);
    inputField = document.getElementById('input-field');;
    inputField.addEventListener("keydown", function(event) {
        if(event.key == 'Enter'){
            addItemSubmit(n);
        }
      }, true);
     
}

function closeInput(){
    inputBlock.style.display = 'none';
    inputBlock.style.backgroundColor = "rgba(24, 24, 24, 0.95)";
}

function addItemSubmit(n){
    let inputValue = inputField.value;
    if (inputValue){
        canUndo = false;
        inputField.value = null;
        inputBlock.style.backgroundColor = "rgba(24, 24, 24, 0.6)";        
        if (masterList[n+2]!= "empty"){
            masterList.splice(n+1,0,"i");
            masterList.splice(n+2,0,inputValue);
        }else{
            masterList.splice(n+2,1,inputValue);
        }
        updateDB();
    }
}

//
//
//  Collapse / Expand
//
//
//

function collapseList(nmb){
    let nameplate = "y";
    if(userIsMikey){
        nameplate = "m"
    }
    userExpanded[nmb] = false;
    docL.set({
        [nameplate] : userExpanded
    }, { merge: true }
    );
}

function expandList(nmb){
    let nameplate = "y";
    if(userIsMikey){
        nameplate = "m"
    }
    userExpanded[nmb] = true;
    docL.set({
        [nameplate] : userExpanded
    }, { merge: true }
    );
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


//
//
// Testing and Debuger
//
//
