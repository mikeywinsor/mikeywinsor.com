const db = firebase.firestore();


const loginBlock = document.getElementById("login-block");
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener("click",login);

// page Load
document.onload =pageLoad();
function pageLoad(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBlock.style.display = 'none';
            // userEmail = user.email;
            // if (userEmail == "mikeywinsor@gmail.com" || userEmail == "bogo@boogle.com" || userEmail == "chicago@boogle.com"){
            //     userIsMikey = true;
            // }
            // docB.onSnapshot(function(doc) {
            //     refreshList();
            // });
        } else {
            loginBlock.style.display = 'block';
            console.log('not logged in');
        }
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
