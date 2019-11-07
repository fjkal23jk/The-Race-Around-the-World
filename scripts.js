var element, stopwatchBox;

element = document.getElementById("startButton");
stopwatchBox = document.getElementById("stopwatch_display");
var startDate, currentDate;

geoFindMe();

function geoFindMe() {
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        userLatitude = latitude;
        userLongitude = longitude;
    }

    function error() {
        alert("Unable to retrieve your location");
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not available on your broswer");
    }

}

function changeButton() {
    if (element.value == "Stop") {
        element.value = "Start";
        stopwatch("Stop");
        //storeTable();
    } else {
        element.value = "Stop";
        stopwatch("Start");
        startDate = new Date();
    }
}


timerId = null;

var hour = 0;
var min = 0;
var sec = 0;
var day = 0;
var display;

function twoDigit(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

function stopwatch(command) {
    if (command === "Start") {
        timerId = setInterval(function() {
            sec++;
            if (sec === 60) {
                sec = 0;
                min++;
            }
            if (min === 60) {
                min = 0;
                hour++;
            }
            if (hour === 24) {
                hour = 0;
                day++;
            }
            display =
                twoDigit(day) +
                ":" +
                twoDigit(hour) +
                ":" +
                twoDigit(min) +
                ":" +
                twoDigit(sec);
            stopwatchBox.innerHTML = display;
            console.log(display);
        }, 1000);
    } else if (command === "Stop") {

        addRow();
        clearInterval(timerId);
    }
}

function getElaspedTime() {
    var totalTimeInSec = (currentDate - startDate) / 1000;
    var timeInDay = totalTimeInSec / (24 * 3600);
    timeInDay = Math.floor(timeInDay);

    totalTimeInSec = totalTimeInSec % (24 * 3600);
    var timeInHour = totalTimeInSec / 3600;
    timeInHour = Math.floor(timeInHour);


    totalTimeInSec %= 3600;
    var timeInMin = totalTimeInSec / 60;
    timeInMin = Math.floor(timeInMin);

    totalTimeInSec %= 60;
    var timeInSec = totalTimeInSec;
    timeInSec = Math.floor(timeInSec);

    var timeElapsedDisplay = twoDigit(timeInDay) + "d" + twoDigit(timeInHour) + "h" +
        twoDigit(timeInMin) + "m" + twoDigit(timeInSec) + "s";

    return timeElapsedDisplay;
}

var userLatitude;
var userLongitude;
var timeElapsed;
var rowNum;
var table;

function addRow() {
    currentDate = new Date();
    timeElapsed = getElaspedTime();
    table = document.getElementById("histTable");




    var newRow = table.insertRow(table.rows.length);

    rowNum = newRow.insertCell(0);
    var currentTime = newRow.insertCell(1);
    var latitude = newRow.insertCell(2);
    var longitude = newRow.insertCell(3);
    var elapsedTime = newRow.insertCell(4);

    storeTable(table.rows.length - 1, currentDate.toLocaleTimeString(), userLatitude, userLongitude, timeElapsed);



    rowNum.innerHTML = table.rows.length - 1;
    currentTime.innerHTML = currentDate.toLocaleTimeString();
    latitude.innerHTML = userLatitude;
    longitude.innerHTML = userLongitude;
    elapsedTime.innerHTML = timeElapsed;

}

function storeData(a, b, c, d, e) {
    localStorage.setItem(a, b, c, d, e);
}



function reset() {
    for (var i = document.getElementById("histTable").rows.length; i > 1; i--) {
        document.getElementById("histTable").deleteRow(i - 1);
    }
    sec = 0,
        min = 0,
        day = 0,
        hour = 0;
    display =
        twoDigit(day) +
        ":" +
        twoDigit(hour) +
        ":" +
        twoDigit(min) +
        ":" +
        twoDigit(sec);
    stopwatchBox.innerHTML = display;
}



function storeTable(a, b, c, d, e) {
    if (storageAvailable('localStorage')) {
        storeData(a, b, c, d, e);
    } else {
        alert("Can't do local storage.");
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
