function _htmlMeuRH(file) {
    try{
        let result = {};
        const startEnd = file.querySelectorAll('.po-select-button')[0].innerText.split(" - ");

        const keypointsRaw = file.querySelectorAll('.text-center.po-sm-4.po-md-4.po-lg-4.po-xl-4');
        let keypoints = _getKeypointsHTML(keypointsRaw, startEnd);

        const systemRaw = Array.from(file.querySelectorAll('.line')).reverse();
        let system = _getSystemHTML(systemRaw, startEnd);
    
        result.system = system;
        result.keypoints = keypoints;
    
        _updateKeypoints(result);
        _updateAusentes(result);
        localStorage.setItem('meuRH', JSON.stringify(result));
        _start();
    } catch (e) {
        _logger(ERROR, e.message || e.toString());
        _setBadgeMessage('meuRH', 'erroGenerico');
    }
}

function _getKeypointsHTML(keypointsRaw, startEnd) {
    let keypoints = {};

    keypoints["Início"] = startEnd[0];
    keypoints["Fim"] = startEnd[1];

    for (let htmlClass of keypointsRaw) {
        let text = htmlClass.innerText;
        let textArray = text.split(" ");
        let key = textArray[0] + " " + textArray[1];
        let value = textArray[2].replace("+", "");

        switch (key) {
            case "SALDO ANTERIOR":
                keypoints["Saldo Anterior"] = value;
                break;
            case "SALDO PERÍODO":
                keypoints["Saldo Valorizado"] = value;
                break;
            case "TOTAL BANCO":
                keypoints["Saldo Atual"] = value;
                break;
        }
    }

    return keypoints;
}

function _getSystemHTML(systemRaw, startEnd) {
    let system = {};

    for (let day of systemRaw) {
        const columnDayRaw = day.querySelector('.column-day');
        const dateRaw = columnDayRaw.querySelector('#lbl-reference-date').innerText
        const date = _getDateHTML(dateRaw, startEnd);

        let systemDay = {
            punches: [],
            observation: ""
        }

        if (date){
            const columnTimesheetRaw = day.querySelectorAll('.column-timesheet, .text-center');
            const divergentAlignRaw = day.querySelectorAll('.divergent-align, .text-center')[2].innerText || "";

            systemDay.punches = _getPunchesHTML(columnTimesheetRaw);
            systemDay.observation = _getObservationHTML(divergentAlignRaw)
        }

        system[date] = systemDay
    }

    return system;
}

function _getDateHTML(dateRaw, startEnd) {
    const dateArr = dateRaw.split("/");
    const startArr = startEnd[0].split("/");
    const endArr = startEnd[1].split("/");

    switch (dateArr[1]) {
        case startArr[1]:
            return dateArr[0] + "/" + dateArr[1] + "/" + startArr[2];
        case endArr[1]:
            return dateArr[0] + "/" + dateArr[1] + "/" + endArr[2];
        default:
            _logger(ERROR, "Invalid period: " + dateRaw);
            return "";
    }
}

function _getPunchesHTML(columnTimesheetRaw){
    let punches = [];
    punches.length
    for (let htmlClass of columnTimesheetRaw) {
        let innerPunches = htmlClass.querySelectorAll('.clocking, .mouse-pointer');
        for (let innerPunch of innerPunches){
            let val = innerPunch.innerText.trim()
            if (_isValidTime(val)){
                punches.push(val);
            }
        }
    }
    return _sortTimeArray(punches);
}

function _sortTimeArray(timeArray) {
    if (timeArray.length){
        const numericValues = timeArray.map(timeStr => {
            const [hours, minutes] = timeStr.split(':');
            return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
          });
        
          numericValues.sort((a, b) => a - b);
        
          const sortedTimeArray = numericValues.map(numericValue => {
            const hours = Math.floor(numericValue / 60);
            const minutes = numericValue % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          });
          return sortedTimeArray;
    } else return timeArray;
  }

function _isValidTime(timeStr) {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(timeStr);
}

function _getObservationHTML(divergentAlignRaw) {
    if (divergentAlignRaw[2] && divergentAlignRaw[2].innerText) {
        return divergentAlignRaw[2].innerText.trim();
    } else return "";
}