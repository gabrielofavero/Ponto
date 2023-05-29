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
        result = _epmToTime(epm);
    } catch (e) {
        result = "00:00"
    }
    outputTime.innerHTML = result
}