var db = firebase.firestore();

var docRef = db.collection("list").doc("h2a0tUXKobzdSeY3DoDW");

var masterList = "";
var sampleItem = "taco sauce";
var lastDeleted = null;

let addBlock = document.getElementById("addBlock");
let undoButton = document.getElementById("undo");
let logoutBlock = document.getElementById('logout');
let undoTextArea = document.getElementById('undoText')
let hideUndo = true;

function importList() {
    docRef.get().then(function(doc) {
        if (doc.exists) {
            masterList = doc.data().checklist1;
            masterList = masterList.split(',');
            console.log(masterList);      
            loadList();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


document.onload =pageLoad();

function pageLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById("login").style.display = "none";
      logoutBlock.style.display = "block";
      addBlock.style.display = "block";
      let userName = user.email;
      let logoutButtonText = `Logout <br>${userName}`;
      document.getElementById("logoutButton").innerHTML = logoutButtonText;
      db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").onSnapshot(function(doc) {
        console.log("Current data: ", doc.data());
        itemList.innerHTML = '';
        importList();
    });

    }
    else {
        document.getElementById("login").style.display = "block";
        logoutBlock.style.display = "none";
        itemList.innerHTML = 'please log in';
    }
  });
}
  
let itemList = document.getElementById('checklist');

function loadList() {
    let i = masterList.length;
    while (i>0) {
        i--;
        printListItem(masterList[i]);
    }

}


// Remove Item from list database

function removeListItem (item) {
    lastDeleted = item;
    document.getElementById(item).style.display = 'none';
    var index = masterList.indexOf(item);
    if (index >= 0) {
        masterList.splice( index, 1 );
    }  
    let updateList = `${masterList}`;
    db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
        checklist1: updateList
    })
    .then(function() {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    //itemList.innerHTML = '';
    if (hideUndo){
        undoButton.style.display = "block";
        hideUndo = false;
    }
    undoTextArea.textContent =`undo remove ${lastDeleted}`;

    //importList();
}

// Add Item to List - take input field, send firebase, UI add item 

let clickAdd= document.getElementById("addButton");
clickAdd.addEventListener("click",addToList);
let inputBar = document.getElementById('itemInput');
inputBar.addEventListener('keyup', function (event) {
    if (event.keyCode === 13){
        clickAdd.click();
    }
});

function addToList() {
    let itemField = inputBar.value;
    if(itemField) {
    inputBar.value = null;
    printListItem(itemField);
    appendDbList(itemField);
    }
}

function appendDbList (toAppend){
    masterList = masterList + "," + toAppend;
    console.log(toAppend);
    db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
        checklist1: masterList
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    console.log(masterList);
    masterList = masterList.split(',');
}

function printListItem (itemName){
    var randColor = makeRandoColor();
    newItem = document.createElement('div');
    deleteIcon = document.createElement('img');
    deleteIcon.src = 'delete.png';
    const newItemHTML = `
    <div id='${itemName}'>
    <div class='checklistItem' style="display:inline-block; border:3px; border-style:solid; border-color:grey; font-size:20px; background-color:${randColor}">${itemName}</div>
    <div style='display:inline-block;'><img src='delete.png' onclick="removeListItem('${itemName}')"></div>
    </div>
    `;
    newItem.innerHTML = newItemHTML;
    itemList.appendChild(newItem);
}

// Undo last item delete

function undoDelete (){
    if (lastDeleted)
    {
        undoButton.style.display = "none";
        undoTextArea.textContent = '';
        hideUndo = true;
        printListItem(lastDeleted);
        appendDbList(lastDeleted);
    }
}


// Login 

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
            itemList.innerHTML = 'items:';
        } 
      });
      
}

let logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener("click",logout);
function logout() {
    itemList.innerHTML = '';
    addBlock.style.display = "none";
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}

function makeRandoColor() {
    var rc = 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
    (Math.floor((256-180)*Math.random()) + 220) + ',' + 
    (Math.floor((256-180)*Math.random()) + 200) + ')';
    return rc;
}

// Enable dev button to reset list

let devButton = document.getElementById('devTest');
devButton.remove();
// devButton.addEventListener("click",devButtonClick);
// function devButtonClick () {
//     console.log('dev button clicked');
//     db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
//         checklist1: "eggs,bacon,butter"
//     })
//     .catch(function(error) {
//         console.error("Error adding document: ", error);
//     });

 
// }
