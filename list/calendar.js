const db = firebase.firestore();

const loginBlock = document.getElementById("login-block");
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener("click",login);

const calendarChart = document.getElementById("calendarChart");
const daysTags = ["X","Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const monthTags = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let calendarStartDay = "Sunday";
let today = new Date();
console.log('Month '+ (parseInt(today.getMonth()) + 1 ));
console.log('date ' + today.getDate());
console.log("day of week " + getDayOfWeek(today));

let currentSelectedDate = "";

// page Load
document.onload =pageLoad();

function pageLoad(){
    closeDayViewWindow();
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
            printCalendar(today);
        } else {
            loginBlock.style.display = 'block';
            console.log('not logged in');
        }
      });

}

function printCalendar(date){
    let d = 1;
    let dayHTML = '';
    let recentStartDay = new Date(date);
    calendarChart.innerText = '';
    if(getDayOfWeek(recentStartDay) != calendarStartDay){
        recentStartDay = findLastSunday(recentStartDay);
        console.log('recent start day: ' + recentStartDay);
    }
    let i = 0;
    let currentPrintDate = new Date(recentStartDay);
    while (d != 8){
        let dayTop = document.createElement('div');
        dayHTML = `${daysTags[d]}`;
        dayTop.innerHTML = dayHTML;
        dayTop.setAttribute('class', 'd'+ d);
        calendarChart.appendChild(dayTop);
        d++;
    }
    d=1;
    let bgColor = makeRandoColor();
    let topBorderDraw = false;
    let borderCounter = 0;
    while (i <= 34){
        //console.log(addDays(currentPrintDate,i));
        let dayContent = document.createElement('div');
        let dayNumber = addDays(currentPrintDate,i).getDate();
        let dayMonth = addDays(currentPrintDate,i).getMonth();
        let dayYear = addDays(currentPrintDate,i).getFullYear();
        if (dayNumber == 1){bgColor = makeRandoColor()};
        dayHTML = `${dayNumber} </br>`;
        dayContent.innerHTML = dayHTML;
        dayContent.setAttribute('class', 'd'+ d);
        if (dayNumber < today.getDate() && dayMonth <= today.getMonth()){
            dayContent.setAttribute('class', 'd'+ d + " past-date-blue");
        }
        dayContent.setAttribute('id',`${dayMonth}-${dayNumber}`);
        if (dayNumber == 1){
            dayContent.style.borderLeft = "solid grey";
            topBorderDraw = true;
            borderCounter = 7;
            };
        if (topBorderDraw){
            dayContent.style.borderTop = "solid grey";
            borderCounter--;
            if (borderCounter == 0){topBorderDraw = false}
        }
        if (dayNumber == today.getDate() && today.getMonth() == dayMonth){
            dayContent.style.border = "thick solid white";
        }
        dayContent.style.backgroundColor = bgColor;
        newIcon = document.createElement('img');
        newIcon.setAttribute("src", `empty.png`);
        let dayViewFormatDate = monthTags[dayMonth].toString() + " " + dayNumber.toString() + " " + dayYear;
        newIcon.setAttribute("onclick", `openDayViewWindow('${dayViewFormatDate}')`);
        dayContent.appendChild(newIcon);
        calendarChart.appendChild(dayContent);
        d++;
        if (d == 8){d=1};
        i++;
    }
    console.log('current print date:  ' + currentPrintDate);
}

function dayViewWindowPlus(){
    console.log("date: " + currentSelectedDate);
}


////// Day View Window
 
function openDayViewWindow(dateToDisplay){
    currentSelectedDate =  convertTextDateToDate(dateToDisplay);
    let dayViewWindow = document.getElementById('day-view-window');
    dayViewWindow.style.display = 'grid';
    let dateNumber = document.getElementById('date-number');
    let findingDay = new Date(currentSelectedDate);
    let textDay = getDayOfWeek(findingDay);
    dateToDisplay = textDay + ", " + dateToDisplay;
    dateNumber.innerText = dateToDisplay;
}

function closeDayViewWindow(){
    let dayViewWindow = document.getElementById('day-view-window');
    dayViewWindow.style.display = 'none';
}

////// Date functions 

function findLastSunday(date){
    let result = new Date(date);
    let i = 1;
    while (i > -7){
        let day = getDayOfWeek(new Date(addDays(date, i)));
        if(day == "Sunday"){
            result = new Date(addDays(date, i));
        };
        i--;
    }
    return result;
}

function convertTextDateToDate(dateString){
////// Ref ..... new Date(year,month,day,hour,min,second)
    let arrayDate = dateString.split(" ");
    let syntaxMonth = monthTags.indexOf(arrayDate[0]);
    let syntaxDate = new Date(arrayDate[2], syntaxMonth, arrayDate[1],0, 0);
    console.log(syntaxDate);
    return syntaxDate;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  }
function makeRandoColor() {
    var rc = 'rgb(' + (Math.floor((256-229)*Math.random()) + 230) + ',' + 
    (Math.floor((256-180)*Math.random()) + 220) + ',' + 
    (Math.floor((256-180)*Math.random()) + 200) + ')';
    return rc;
}


//  LLLLLLLLLLLLLLLLLLLLLL______ LOGIN


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
