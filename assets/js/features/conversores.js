function _startConversores() {
    const inputTime = document.getElementById('inputTime');
    const inputEPM = document.getElementById('inputEPM');
    
    inputTime.addEventListener('input', (event) => {
        _loadTimeToEPM(event.target.value);
    });

    inputEPM.addEventListener('input', (event) => {
        _loadEPMToTime(event.target.value);
    });
}

function _loadTimeToEPM(time){
    const outputEMP = document.getElementById('outputEPM');
    let result;
    try {
        result = _timeToEPM(time);
    } catch (e) {
        result = "0,0"
    }
    outputEMP.innerHTML = result
}

function _loadEPMToTime(epm){
    const outputTime = document.getElementById('outputTime');
    try {
        const split = epm.split(".");
        if (split[1] && split[1].length > 1){
            let beforeComma = parseFloat(split[0])
            let afterComma = parseFloat('0.' + split[1]).toFixed(1)
            epm = (beforeComma + afterComma).toString();
        } else if (split.length == 1){
            epm = split[0] + ".0"
        }
        result = _epmToTime(epm);
    } catch (e) {
        result = "00:00"
    }
    outputTime.innerHTML = result
}