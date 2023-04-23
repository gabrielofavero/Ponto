function _timeToNumber(time) {
    let split = time.split(":");
    let hour = parseInt(split[0]);
    let minute = parseFloat(split[1]) / 60
    return hour + minute;
}

function _numberToTime(number) {
    let hour = Math.floor(number);
    let minute = Math.round((number - hour) * 60);

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

function _sumTime (timeArray){
    let hour = 0;
    let minute = 0;
    for (let i = 0; i < timeArray.length; i++){
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

function _epmToNumber(epm) { // "90,4h" -> 90.4
    return parseFloat(epm.replace(",", "."));
}

function _findByDateAndCompare(date) {
    let epm = JSON.parse(localStorage.getItem('EPM'));
    let meuRH = JSON.parse(localStorage.getItem('meuRH'));

    if (epm[date] && meuRH[date]) {
        _timeDifference(epm[date], meuRH[date]);
    } else return "";
}

function _compare() {
    let epm = JSON.parse(localStorage.getItem('EPM-result'));
    let meuRH = JSON.parse(localStorage.getItem('meuRH-result'));
    let result = {};
    
    let keys = Object.keys(epm);

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (epm[key] && meuRH[key]) {
            result[key] = _timeDifference(epm[key], meuRH[key]);
        }
    }
    console.log(result);
}
