var config = {
    apiKey: "AIzaSyCkEVzMDMBLDT7OE4oiVateRykljXaecd8",
    authDomain: "trainschedule-78382.firebaseapp.com",
    databaseURL: "https://trainschedule-78382.firebaseio.com",
    projectId: "trainschedule-78382",
    storageBucket: "trainschedule-78382.appspot.com",
    messagingSenderId: "19942116627"
  };
firebase.initializeApp(config);

var name, destination, frequency, nextarrival, minutesaway, firsttrain, database = firebase.database();

function clear() {
    $("#name_box").val('');
    $("#destination_box").val('');
    $("#frequency_box").val('');
    $("#firsttrain_box").val('');
};

$("#submit").on("click", function () {
    datetext = new Date().toTimeString().split(' ')[0];
    current_time_seconds = (parseInt(datetext.split(':')[0])*3600)+(parseInt(datetext.split(':')[1])*60)+(parseInt(datetext.split(':')[2]));
    name = $("#name_box").val().trim();
    destination = $("#destination_box").val().trim();
    frequency = $("#frequency_box").val().trim();
    firsttrain = $("#firsttrain_box").val().trim();
    firsttrain_seconds = (firsttrain.split(':')[0] * 3600) + (firsttrain.split(':')[1]) * 60;
    current_diff = current_time_seconds - firsttrain_seconds;
    if (current_diff > 0.0) {
        for (let index = firsttrain_seconds; index < (current_time_seconds + ((frequency * 60))); index = index + (frequency * 60)) {
            if (index > current_time_seconds) {
                var hours   = Math.floor(index / 3600);
                var minutes = Math.floor((index - (hours * 3600)) / 60);
                var seconds = index - (hours * 3600) - (minutes * 60);           
                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                minutesaway = parseInt((index - current_time_seconds)/60)
                nextarrival = hours+':'+minutes;
            };
        };
    }else{
        nextarrival = firsttrain
        minutesaway = parseInt((firsttrain_seconds - current_time_seconds) / 60)
    };
    database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    nextarrival: nextarrival,
    minutesaway: minutesaway,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    clear();
});

database.ref().orderByChild("frequencyAdded").on("child_added", function (snapshot) {
    var sv = snapshot.val();
    var newRow = $("<tr>");
    newRow.append("<td><h6>" + sv.name + "</h6></td>").append("<td><h6>" + sv.destination + "</h6></td>").append("<td><h6>" + sv.frequency + "</h6></td>").append("<td><h6>" + sv.nextarrival + "</h6></td>").append("<td><h6>" + minutesaway + "</h6></td>");
    $("tbody").append(newRow);
});

$("#clear_fields").on("click", function () {
    clear();
});