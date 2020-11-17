/// not my code from (https://codepen.io/sashatran/pen/mOWLLB)

myDate = new Date();
xmas = Date.parse("Dec 25, " + myDate.getFullYear());
today = Date.parse(myDate);

daysToChristmas = Math.round((xmas - today) / (1000 * 60 * 60 * 24));

if (daysToChristmas == 0) $("#days").text("It's Christmas!! Merry Christmas!");

if (daysToChristmas < 0)
  $("#days").text("Christmas was " + -1 * daysToChristmas + " days ago.");

if (daysToChristmas > 0)
  $("#days").text(daysToChristmas + " days to Christmas!");

//make snow
snowDrop(150, randomInt(1, 285));
snow(150, 150);

function snow(num, speed) {
  if (num > 0) {
    setTimeout(function () {
      $("#drop_" + randomInt(1, 250)).addClass("animate");
      num--;
      snow(num, speed);
    }, speed);
  }
}

function snowDrop(num, position) {
  if (num > 0) {
    var drop = '<div class="drop snow" id="drop_' + num + '"></div>';

    $("body").append(drop);
    $("#drop_" + num).css("left", position);
    num--;
    snowDrop(num, randomInt(1, 285));
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
