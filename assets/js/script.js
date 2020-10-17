let workoutType = "";
let workoutLength = "";
let videoFrame = "";

if (typeof localStorage.myworkouts === "undefined") {
  var workoutLibrary = [];
} else {
  var workoutLibrary = JSON.parse(localStorage.getItem("myworkouts"));
}

function getmetValues(type) {
  let metValue = 1;
  switch (type) {
    case "zumba":
      metValue = 8.8;
      break;
    case "yoga":
      metValue = 4;
      break;
    case "hiit":
      metValue = 8;
      break;
    case "strength":
      metValue = 6;
      break;
    case "pilates":
      metValue = 3.7;
      break;
  }
  return metValue;
}
function caloriesBurned() {
  let calburnt = 0;
  var currentUser = JSON.parse(localStorage.getItem("userProfile"));
  console.log(getmetValues(workoutType));
  calburnt =
    (currentUser.weight / 2.205) *
    getmetValues(workoutType) *
    0.0175 *
    parseInt(workoutLength);
  console.log(Math.floor(calburnt));
  return Math.floor(calburnt);
}
$(document).ready(function () {
  // if (typeof localStorage.userProfile !== undefined) {
  //     $(".welcomeBack").attr("class","welcomeBack show");
  //     $("#title").attr("class","hide");
  // }
});
$("#submit").on("click", function (event) {
  event.preventDefault();
  let varname = fullName.value;
  let varemail = email.value;
  let varheightFoot = heightFoot.value;
  let varheightInch = heightInch.value;
  let varweight = weightinlbs.value;
  console.log("name " + varname);
  console.log("email " + varemail);
  console.log("foot " + varheightFoot);
  console.log("inch " + varheightInch);
  console.log("Weight " + varweight);
  if (varheightFoot == "") {
    $("#validation_height").html("<p>Please enter a valid height value</p>");
  } else if (isNaN(varweight) || varweight === "") {
    $("#validation_weight").html("<p>Please enter a valid weight value</p>");
    $("#validation_height").attr("class", "hide");
  } else {
    $("#validation_weight").attr("class", "hide");
    $("#validation_height").attr("class", "hide");
    let varbmi = (
      (703 * parseFloat(varweight)) /
      Math.pow(12 * parseInt(varheightFoot) + parseInt(varheightInch), 2)
    ).toFixed(2);
    console.log("BMI " + varbmi);
    let userProfile = {
      full_name: varname,
      email: varemail,
      heightFoot: varheightFoot,
      heightInch: varheightInch,
      weight: varweight,
      bmi: varbmi,
    };
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    $("#selectnextPage").attr("class", "show");
  }
});
$(".workout-type").on("click", function (event) {
  console.log($(this).attr("id"));
  workoutType = $(this).attr("id");
  $(this)
    .toggleClass("workout-selected")
    .siblings()
    .removeClass("workout-selected");
});
$(".workout-length").on("click", function (event) {
  console.log($(this).attr("id"));
  workoutLength = $(this).attr("id");
  $(this)
    .toggleClass("workout-selected")
    .siblings()
    .removeClass("workout-selected");
  let calburnt = caloriesBurned();
  console.log(calburnt);
});
$("#show-workout").on("click", function (event) {
  let apikey = "AIzaSyAtCIQm7CsHtSXhOpYspW3Opq-1dKI7PmA";
  event.preventDefault();
  if (workoutType === "" || workoutLength === "") {
    $("#calories-info").html(
      "<p> Please choose workout type and length to continue </p>"
    );
    return;
  }
  let url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&order=rating&q=" +
    workoutLength +
    " min " +
    workoutType +
    "&regionCode=us&relevanceLanguage=en&type=video&videoEmbeddable=true" +
    "&key=" +
    apikey;
  console.log(url);
  $.ajax({
    url: url,
    method: "GET",
  }).then(function (response) {
    let videoIndex = Math.floor(Math.random() * 25);
    let videoID = response.items[videoIndex].id.videoId;
    console.log(videoID);
    let urlVideo =
      "https://www.googleapis.com/youtube/v3/videos?part=player&id=" +
      videoID +
      "&maxHeight=342&maxWidth=608" +
      "&key=" +
      apikey;
    $.ajax({
      url: urlVideo,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log(response.items[0].player.embedHtml);
      videoFrame = response.items[0].player.embedHtml;
      $("#calories-info").html(
        " <p class='calories-display'> Awesome! This workout will burn about " +
          caloriesBurned() +
          " calories for you </p>"
      );
      $("#display-video").html(videoFrame);
      $("#display-video").attr("class", "card cell small-4 show");    
      $("#schedule-workout").attr("class", "card cell small-4 show");    
      $("#calories-info").attr("class", "card cell small-4 border-none show");    
    });
  });
});
$("#add-to-library").on("click", function (event) {
  event.preventDefault();
  let video_small = videoFrame.replace('width="608"', 'width="200"');
  video_small = video_small.replace('height="342"', 'height="112.5"');
  workoutLibrary.push(video_small);
  localStorage.setItem("myworkouts", JSON.stringify(workoutLibrary));
  loadWorkoutLibrary();
});
function loadWorkoutLibrary() {
  $("#workout-videos-list").html("");
  if (typeof localStorage.getItem("myworkouts") !== undefined) {
    let myworkOuts = JSON.parse(localStorage.getItem("myworkouts"));
    console.log(myworkOuts);
    let mydiv = "";
    myworkOuts.forEach((element) => {
      console.log(element);
      mydiv = $("<div>").html(element);
      mydiv.attr("class", "workout-library-display");
      $("#workout-videos-list").prepend(mydiv);
    });
  }
  openNav();
}
function openNav() {
  document.getElementById("mySidebar").style.width = "350px";
  document.getElementById("main").style.marginLeft = "350px";
}
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}
$("#workoutTime").change(function(event){
  //alert ("function called" + workoutTime.value);
  // $(".start").html = workoutTime.value;
  // let dt = new Date(workoutTime.value);
  // dt.setMinutes(dt.getMinutes() + 30);
  // $(".end").html(dt);
  // $(".title").html("Workout");
  // $(".description").html("Test");
  $("#add-calendar").attr("class","addeventatc show");
})