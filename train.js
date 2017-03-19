
$(document).ready(function() {
    
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAtZiydLZXagbB94ueqJe-r01mzKKm-mks",
    authDomain: "hellohello-7cb63.firebaseapp.com",
    databaseURL: "https://hellohello-7cb63.firebaseio.com",
    storageBucket: "hellohello-7cb63.appspot.com",
    messagingSenderId: "224223752463"
  };
  firebase.initializeApp(config);


    //current time display on the page
    var userTime = moment().format('MMM Do YYYY, h:mm:ss a');
    $("#userTime").append(userTime);

    // database ref
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destination = "";
    var frequency = 0;
    var firstTrainTime = 0;
    var firstTime = [];

    // Capture Button Click
    $("#add-train").on("click", function() {

        // Don't refresh the page!
        event.preventDefault();

        // getting our values ready to input in firebase
        trainName = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
        frequency = $("#frequency-input").val().trim();

        console.log(firstTrainTime);


        //pushing to the database
        database.ref("/trains").push({
            trainName: trainName,
            Destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            //time user submittedon server time (keeps all stamps on same TZ)
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

        //empty the form
        $("#name-input").val(" ");
        $("#destination-input").val(" ");
        $("#time-input").val(" ");
        $("#frequency-input").val(" ");
    });

    database.ref("/trains").on("child_added", function(childSnapshot) {

        // Store everything into a variable. t stand for train ya'll.
        var tName = childSnapshot.val().trainName;
        var tDestination = childSnapshot.val().Destination;
        var tFrequency = childSnapshot.val().frequency;
        var tFirstTrain = childSnapshot.val().firstTrainTime;

        // calculate minutes til arrival by taking the current time in unix subtract the FirstTrain 
        //time then find the modulus of the difference and frequency  
        var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
        var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
        var tMinutes = tFrequency - tRemainder;

        // To calculate the arrival time, add the tMinutes to the currrent time
        var tArrival = moment().add(tMinutes, "m").format("hh:mm A");

        if (tMinutes <= 5 ) {
        $("#5min").append(
            "<tr>" +
            "<td>" + tName + "</td>" +
            "<td>" + tDestination + "</td>" +
            "<td>" + tFrequency + "</td>" +
            "<td>" + tArrival + "</td>" +
            "<td><font color='red'>" + tMinutes + "</td></font>" + "</tr>");
        return;
        }


        //Push to the DOM
        $("#mainTable").append(
            "<tr>" +
            "<td>" + tName + "</td>" +
            "<td>" + tDestination + "</td>" +
            "<td>" + tFrequency + "</td>" +
            "<td>" + tArrival + "</td>" +
            "<td>" + tMinutes + "</td>" + "</tr>"
        );
        // Handles errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});