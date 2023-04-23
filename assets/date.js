function _timeToNumber(time) {
    let split = time.split(":");
    let hour = parseInt(split[0]);
    let minute = parseFloat(split[1]) / 60
    return (hour + minute).toFixed(2);
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

function _extractNumber(time1, time2) {
    let numb1 = _timeToNumber(time1);
    let numb2 = _timeToNumber(time2);
    return numb2 - numb1;
}

