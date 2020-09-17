var db = firebase.firestore();

var docRef = db.collection("list").doc("h2a0tUXKobzdSeY3DoDW");
var docSelect = db.collection("selectedList").doc("666");

//var masterList = "";
var allData = null;
var sampleItem = "taco sauce";
var lastDeleted = null;
var lastDeletedList= null;
var lastDeletedListItems = null;
var allLists = null;
var selectedList = '';
var selectedListItems = '';


let addBlock = document.getElementById("addBlock");
let undoButton = document.getElementById("undo");
let logoutBlock = document.getElementById('logout');
let undoTextArea = document.getElementById('undoText');
let itemList = document.getElementById('checklist');
let hideUndo = true;

const smallSpace = `<div style='padding:5px;'></div>`

document.onload =pageLoad();

function pageLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      document.getElementById("login").style.display = "none";
      logoutBlock.style.display = "block";
      addBlock.style.display = "block";
      let userName = user.email;
      let logoutButtonHTML = `
      <div style='background-color: lightsteelblue; border:6px; border-style:solid; border-color:darkgray'>
      Logout <br>${userName}
      </div>`;
      docSelect.get().then(function(doc) {
            if (doc.exists) {
            selectedList = doc.data().selected;
            selectedList = selectedList.toString();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            }).catch(function(error) {
        console.log("Error getting document:", error);
        });
      document.getElementById("logoutButton").innerHTML = logoutButtonHTML;
      docRef.onSnapshot(function(doc) {
        //console.log("Current data: ", doc.data());
        itemList.innerText = '';
        importList();
    });

    }
    else {
        document.getElementById("login").style.display = "inline-block";
        logoutBlock.style.display = "none";
        itemList.innerText = 'please log in';
    }
  });
}

function importList() {
    docRef.get().then(function(doc) {
        if (doc.exists) {
            allData = doc.data();
            //console.log(allData);
            allLists = Object.keys(allData);
            //console.log(allLists);     

            refreshList();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function refreshList () {
    let index = allLists.indexOf(selectedList);
    let selObj = allLists[index];
    allLists.splice(index,1);
    allLists.push(selObj);
    let i = allLists.length;
    let currentListItems = '';
    itemList.innerText = '';
    while (i>0) {
        i--;
        printListTitle(allLists[i],i);
        currentListItems = allData[allLists[i]].split(',');
        let q = currentListItems.length;
        itemList.innerHTML += smallSpace;
        if (allLists[i] == selectedList){
            selectedListItems = currentListItems;
        }
        while (q>0){
            q--;
            printListItem(currentListItems[q], allLists[i], i, q);
            itemList.innerHTML += smallSpace;

            //Developing numerical locations
            //console.log(currentListItems[q] + "  " + allLists[i] + " q:" + q + " i:" + i);
        }
        
    }
    printAddList ();
}

//Remove an Item from a List

function removeItem (listId, itemId){
    let item = allData[allLists[listId]].split(',')[itemId];
    let list = allLists[listId];
    //console.log('item ' + item + ' list ' + list );
    lastDeleted = item;
    lastDeletedList = list;
    let idx = allLists.indexOf(list);
    lastDeletedListItems = allData[allLists[idx]];
    let updatedList = `${allData[list]}`;
    updatedList = updatedList.split(',');
    console.log(updatedList);
    let index = updatedList.indexOf(item);
    if (index >= 0) {
        updatedList.splice( index, 1 );
     }
    updatedList = updatedList.join(",");
    if(updatedList == ""){updatedList = "empty"};
    db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
        [list]: updatedList
    }, { merge: true })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    if (hideUndo){
        undoButton.style.display = "block";
        hideUndo = false;
    }
    undoTextArea.textContent =`undo remove ${lastDeleted}`;

}


function removeList(listId){
    let listName = allLists[listId];
    //console.log("remove list " + listName);

        //Need to fix. If less than 2 lists, can't delete

    if (allLists.length >= 1){

    }
    if(selectedList != allLists[0]){
        selectedList = allLists[0];
        db.collection("selectedList").doc("666").set({
            selected : selectedList
        }); 
    }else{
        selectedList = allLists[1];
        db.collection("selectedList").doc("666").set({
            selected : selectedList
        }); 
    }
    db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").update({
        [listName]: firebase.firestore.FieldValue.delete()
    });    
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
    if (selectedListItems == "empty")
    {
        db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
            [selectedList] : toAppend
        }, { merge: true });
    }else{
        selectedListItems = selectedListItems + "," + toAppend;
        db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
            [selectedList] : selectedListItems
        }, { merge: true });
        selectedListItems = selectedListItems.split(',');
    }

}

function printListItem (item, list, listId, itemId){
    var randColor = makeRandoColor();
    newItem = document.createElement('div');
    var newItemHTML = `
    <div id='${item}'>
    <div class='checklistItem' style="display:inline-block; border:3px; border-style:solid;
    border-color:rgb(162, 179, 189); font-size:20px; background-color:${randColor}">${item}</div>
    <div style='display:inline-block;'><img src='delete.png' onclick="removeItem('${listId}','${itemId}')"></div>
    </div>
    `;
    if (item == "empty"){
        newItemHTML = `<div style='color:rgb(162, 179, 189)'>empty</div>`;
    };
    newItem.innerHTML = newItemHTML;
    itemList.appendChild(newItem);
}

function printListTitle (listName, listId){
    var randColor = makeRandoColor();
    newItem = document.createElement('div');
    let newItemHTML = `
    <div id='${listName}' style="text-align:left;">
    <div class='checklistItem' onclick="selectList('${listId}')" style="display:block; text-align:left; text-shadow: 2px 2px 5px darkgrey; 
    border:10px; border-style:solid; border-color:rgb(137, 154, 163); font-size:20px; background-color:${randColor}">${listName}
    </div>
    </div>
    `;
    if (selectedList) {
        //console.log(listName + ' <- list name ' + selectedList + ' <- selected List' );
        if (selectedList == listName){
            newItemHTML = `
            <div id='${listName}' style="display:in-line block; box-shadow: 2px 2px 1px 2px #9da3a6;"><div class='checklistItem' 
            style="font-weight: bold; text-align:left;text-shadow: 1px 2px 2px lightgrey;
             border:10px; border-style:solid; border-color:rgb(237, 183, 184); font-size:24px; background-color:white">${listName}
             <img src='delete.png' style="float:right; text-align:left;" 
             onclick="removeList('${listId}')"></div></div>
            `;
        }
    }
    newItem.innerHTML = newItemHTML;
    itemList.appendChild(newItem);
}

function printAddList (){
    var randColor = makeRandoColor();
    newItem = document.createElement('div');
    // deleteIcon = document.createElement('img');
    // deleteIcon.src = 'plus.png';
    const newItemHTML = `
    <div id='addNewList' style="text-align:left;">
    <div class='checklistItem' id='addListButton' 
    style="display:inline-block; text-shadow: 2px 0px 5px darkgrey; 
    border:10px; border-style:solid; border-color:lightgrey; 
    font-size:20px; background-color:${randColor}">
    <img src='plus.png' onclick="addNewList()">
    </div>
    </div>
    `;
    newItem.innerHTML = newItemHTML;
    itemList.appendChild(newItem);
    itemList.innerHTML += smallSpace;
}

function addNewList(){
    let addListLoc = document.getElementById("addListButton");
    addListLoc.innerHTML = '';
    let newHTML = `
    <div style="display:inline-block">
    <input id='newListInput' type="text" size='18' placeholder="add a list"> <img id='newListAddButton' src='plus.png'>
    </div>
    `;
    let inputBar = document.createElement('div');
    inputBar.innerHTML = newHTML;
    addListLoc.appendChild(inputBar);
    var listAddButton = document.getElementById("newListAddButton");
    listAddButton.addEventListener("click",appendListDatabase);
    let inputListBar = document.getElementById('newListInput');
    inputListBar.addEventListener('keyup', function (event) {
    if (event.keyCode === 13){
        listAddButton.click();
    }
    });
}

function appendListDatabase (){
    let newLN = document.getElementById('newListInput').value;
    //console.log(newLN);
    if(newLN){
        db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
            [newLN] : "empty"
        }, { merge: true });
    };
    refreshList();
}

function selectList (listId) {
    let name = allLists[listId]; 
    selectedList = name;
    db.collection("selectedList").doc("666").set({
        selected : name
    }); 
    refreshList();
    document.body.scrollTop = 40;
    document.documentElement.scrollTop = 40;
    //console.log(lastDeletedListItems);
}



// Undo last item delete

function undoDelete (){
    if (lastDeleted)
    {
        undoButton.style.display = "none";
        undoTextArea.textContent = '';
        hideUndo = true;
        //lastDeletedListItems = lastDeletedListItems.join(",");
        db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
                [lastDeletedList] : lastDeletedListItems
            }, { merge: true });
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
            console.log('onAuthStateChanged(function(user');
        } 
      });
      
}

let logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener("click",logout);
function logout() {
    itemList.innerText = '';
    addBlock.style.display = "none";
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });

}

function funMoneyClick (){


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = 'funmoney.html';
        } 
      });


    
}


function makeRandoColor() {
    var rc = 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
    (Math.floor((256-190)*Math.random()) + 220) + ',' + 
    (Math.floor((256-190)*Math.random()) + 200) + ')';
    return rc;
}

// Enable dev button to reset list

let devButton = document.getElementById('devTest');
devButton.remove();
// devButton.addEventListener("click",devButtonClick);
// function devButtonClick () {
//     let item = `Trader Joe's`;
//     var randColor = makeRandoColor();
//     newItem = document.createElement('div');
//     var newItemHTML = `
//     <div id='${item}'>
//     <div class='checklistItem' style="display:inline-block; border:3px; border-style:solid;
//     border-color:rgb(162, 179, 189); font-size:20px; background-color:${randColor}">${item}</div>
//     <div style='display:inline-block;'><img src='delete.png'></div>
//     </div>
//     `;
//     if (item == "empty"){
//         newItemHTML = `<div style='color:rgb(162, 179, 189)'>empty</div>`;
//     };
//     newItem.innerHTML = newItemHTML;
//     itemList.appendChild(newItem);
// }

// var setWithMerge = db.collection("list").doc("h2a0tUXKobzdSeY3DoDW").set({
//     Kroger: "chicken,milk,butter"
// }, { merge: true });

let devButtonTwo = document.getElementById('devTestTwo');
devButtonTwo.remove();
// devButtonTwo.addEventListener("click",devButtonClickTwo);
// function devButtonClickTwo () {

//     var setWithMerge = db.collection("funmoney").doc("amounts").set({
//         Bogo: 174
//     }, { merge: true });

// }

