$(document).ready(function () {
//intialize firebase
var config = {
    apiKey: "AIzaSyAnAUrpUr1IjBHe97TZw9b--Svj99FTCGk",
    authDomain: "trainschedule-8c67f.firebaseapp.com",
    databaseURL: "https://trainschedule-8c67f.firebaseio.com",
    projectId: "trainschedule-8c67f",
    storageBucket: "trainschedule-8c67f.appspot.com",
    messagingSenderId: "506641170237"
  };
  firebase.initializeApp(config);  

  var database = firebase.database();

    var currentTime = moment();
    // console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:ss A'));

  //time stamp
  setInterval(function() {
    $('.currentTime').text(moment().format('h:mm:ss A'))
  },1000
  );
  //button to add train
  $("#addTrain").on("click", function (event) {
      event.preventDefault();
  //get values from text box
  var trainName = $("#trainName").val().trim();
  var trainDestination = $("#trainDestination").val().trim();
  var firstTrain = $("#firstTrain").val().trim();
  var frequency = $("#frequency").val().trim();
  console.log("about to save", trainName)
  //initiate push
  database.ref().push({
    trainName: trainName,
    destination: trainDestination,
    firstTrain: firstTrain,
    frequency: frequency
  
});
  });

  //initial load
  database.ref().on("child_added", function (childSnapshot) {
    console.log("data info", childSnapshot.val())
    var newTrain = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFreq = childSnapshot.val().frequency;

//first Time (pushed back 1 year to make sure it comes before current time)
var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

//current Time
var currentTime = moment();

//difference between times
var diffTime = moment().diff(moment(startTimeConverted), "minutes");

//time apart
var tRemainder = diffTime % newFreq;

//min until train
var tMinutesTillTrain = newFreq - tRemainder;
console.log("MinutesTillTrain", tMinutesTillTrain)
//next train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
var catchTrain = moment(nextTrain).format('hh:mm:ss A');

//display on page
$("#displayAll").append(
  ' <tr><td>' + newTrain +
  ' </td><td>' + newDestination +
  ' </td><td>' + newFreq +
  ' </td><td>' + catchTrain +
  ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
  
updateCurrentTime: () => {
    $('.currentTime').text(moment().format('h:mm:ss A'))
}


//clear input fields
$("#trainName, #trainDestination, #firstTrain, #frequency").val("");
return false;
},

function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

});