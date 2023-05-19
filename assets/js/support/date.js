function _timeToNumber(time) {
    let split = time.split(":");
    let hour = parseInt(split[0]);
    let minute = parseFloat(split[1]) / 60
    return hour + minute;
}

function _numberToTime(number) {
    let before = "";

    if (number < 0) {
        before = "-"
        number = -number;
    }

    let hour = Math.floor(number);
    let minute = Math.round((number - hour) * 60);
    return before + _hourMinuteToTime(hour, minute);
}

function _hourMinuteToTime(hour, minute) {
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    return hour + ":" + minute;
}

function _removeYear(date) {
    let split = date.split("/");
    return split[0] + "/" + split[1];
}

function _isFullDate(date) {
    let split = date.split("/");
    return split.length == 3 && split[0] <= 31 && split[1] <= 12 && split[2].length == 4;
}

function _isLater(time1, time2) {
    let split1 = time1.split(":");
    let split2 = time2.split(":");
    if (split1[0] > split2[0]) {
        return true;
    } else if (split1[0] == split2[0]) {
        return split1[1] > split2[1];
    } else {
        return false;
    }
}

function _sumTime(timeArray) {
    let hour = 0;
    let minute = 0;
    for (let i = 0; i < timeArray.length; i++) {
        let split = timeArray[i].split(":");
        hour += parseInt(split[0]);
        minute += parseInt(split[1]);
    }
    hour += Math.floor(minute / 60);
    minute = minute % 60;

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    return hour + ":" + minute;
}

function _timeDifference(time1, time2) {
    let split1 = time1.split(":");
    let split2 = time2.split(":");
    let hour = parseInt(split2[0]) - parseInt(split1[0]);
    let minute = parseInt(split2[1]) - parseInt(split1[1]);
    if (minute < 0) {
        hour--;
        minute += 60;
    }
    return hour + ":" + minute;
}

function _timeToEPM(time) {
    let split = time.split(":");
    let hour = parseInt(split[0]);
    let minute = parseInt(split[1]);
    return _numberToEpm(hour + minute / 60);
}

function _stringNumberToEPM(string) {
    let epm = _epmToNumber(string);
    return _numberToEpm(epm);
}

function _epmToNumber(epm) { // "90,4h" -> 90.4
    return parseFloat(parseFloat(epm.replace(",", ".").replace("h","")).toFixed(1))
}

function _numberToEpm(number) {
    return number.toFixed(1).replace(".", ",");
}

function _dateStringToDateStringNoYear(dateString){
    let split = dateString.split("/");
    return split[0] + "/" + split[1];
}

function _getDate(dateString) {
    let split = dateString.split("/");
    return new Date(split[2], split[1] - 1, split[0]);
}

function _dateToDateStringNoYear(date){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (day < 10){
        day = "0" + day;
    }
    if (month < 10){
        month = "0" + month;
    }
    return day + "/" + month;
}

function _getEarliest(dateArray){
    let earliest = dateArray[0];
    for (let i = 1; i < dateArray.length; i++){
        if (dateArray[i] && dateArray[i] < earliest){
            earliest = dateArray[i];
        }
    }
    return earliest;
}

function _getLatest(dateArray){
    let latest = dateArray[0];
    for (let i = 1; i < dateArray.length; i++){
        if (dateArray[i] && dateArray[i] > latest){
            latest = dateArray[i];
        }
    }
    return latest;
}



function _isTimeStringBiggerThen(timeString, biggerThen) {
    let split1 = timeString.split(":");
    let split2 = biggerThen.split(":");
    if (split1[0] > split2[0]) {
        return true;
    } else if (split1[0] == split2[0]) {
        return split1[1] > split2[1];
    } else {
        return false;
    }
}
