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

function _dateToDateStringNoYear(date) {
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

    return _hourMinuteToTime(hour, minute);
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
    return _hourMinuteToTime(hour, minute);
}

function _timeToEPM(time) {
    let split = time.split(":");
    let hour = parseInt(split[0]);
    let minute = parseInt(split[1]);
    return _numberToEpm(hour + minute / 60);
}

function _epmToTime(epm) {
    let number = _epmToNumber(epm);
    let hour = Math.floor(number);
    let minute = (number - hour) * 60;
    minute = Math.round(minute)

    if (isNaN(hour) || isNaN(minute)) {
        return "00:00"
    } else return _hourMinuteToTime(hour, minute)
}

function _stringNumberToEPM(string) {
    let epm = _epmToNumber(string);
    return _numberToEpm(epm);
}

function _epmToNumber(epm) { // "90,4123h" -> 90.4
    return parseFloat(parseFloat(epm.replace(",", ".").replace("h", "")))
}

function _numberToEpm(number) {
    return number.toFixed(1).replace(".", ",");
}

function _dateStringToDateStringNoYear(dateString) {
    let split = dateString.split("/");
    return split[0] + "/" + split[1];
}

function _getDate(dateString) {
    let split = dateString.split("/");
    return new Date(split[2], split[1] - 1, split[0]);
}

function _getDateString(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + "/" + month + "/" + year;
}

function _dateToDateStringNoYear(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + "/" + month;
}

function _getEarliest(dateArray) {
    let earliest = dateArray[0];
    for (let i = 1; i < dateArray.length; i++) {
        if (dateArray[i] && dateArray[i] < earliest) {
            earliest = dateArray[i];
        }
    }
    return earliest;
}

function _isTimeString(string) {
    let result = false;
    if (string) {
        const split = string.split(":");
        if (split.length == 2 && !isNaN(split[0]) && !isNaN(split[1])) {
            result = true;
        }
    }
    return result;
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

function _getDayOfTheWeek(key) {
    const daysOfWeek = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado'
    ];

    const dateParts = key.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);
    const dayOfWeekIndex = date.getDay();

    return daysOfWeek[dayOfWeekIndex];
}

function _orderArrayByTime(array) {
    const timeArray = array;

    timeArray.sort((time1, time2) => {
        const [hours1, minutes1] = time1.split(':');
        const [hours2, minutes2] = time2.split(':');

        const time1InMinutes = parseInt(hours1) * 60 + parseInt(minutes1);
        const time2InMinutes = parseInt(hours2) * 60 + parseInt(minutes2);

        return time1InMinutes - time2InMinutes;
    });

    return timeArray;
}

function _dateInputToDateString(inputValue){
    const dateParts = inputValue.split('-');
    return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
}