// === Main Function ===
function _startConversores() {
    const inputTime = document.getElementById('inputTime');
    const inputEPM = document.getElementById('inputEPM');
    const inputTotal = document.getElementById('inputTotal');
    const inputUsadas = document.getElementById('inputUsadas');

    _loadConvertionURLParameters();

    inputTime.addEventListener('input', (event) => {
        _loadTimeToEPM(event.target.value);
    });

    inputEPM.addEventListener('input', (event) => {
        _loadEPMToTime(event.target.value);
    });

    inputTotal.addEventListener('input', (event) => {
        _loadConvertionHours();
    });

    inputUsadas.addEventListener('input', (event) => {
        _loadConvertionHours();
    });
}

// === Loaders ===
function _loadTimeToEPM(time) {
    const outputEMP = document.getElementById('outputEPM');
    let result;
    try {
        result = _timeToEPM(time);
    } catch (e) {
        result = "0,0"
    }
    outputEMP.innerHTML = result
}

function _loadEPMToTime(epm) {
    let result = "--:--"
    const outputTime = document.getElementById('outputTime');
    try {
        if (parseFloat(epm) < 1000 && parseFloat(epm) > -1000) {
            const split = epm.split(".");
            if (split[1] && split[1].length > 1) {
                let beforeComma = parseFloat(split[0])
                let afterComma = parseFloat(parseFloat('0.' + split[1]).toFixed(1));
                epm = (beforeComma + afterComma).toString();
            } else if (split.length == 1) {
                epm = split[0] + ".0"
            }
            result = _epmToTime(epm);
        }
    } catch (e) {
        result = "00:00"
    }
    outputTime.innerHTML = result
}

function _loadConvertionHours() {
    const totalVal = document.getElementById("inputTotal").value;
    const usadasVal = document.getElementById("inputUsadas").value;
    const outputDiv = document.getElementById("outputRestante");

    let result = "-,-"

    let totalNum = 0;
    let usadasNum = 0;

    if (totalVal && !isNaN(totalVal)) {
        totalNum = parseFloat(totalVal).toFixed(1);
    }

    if (usadasVal && !isNaN(usadasVal)) {
        usadasNum = parseFloat(usadasVal).toFixed(1);
    }

    if (totalNum > -100 && totalNum < 100 && usadasNum > -100 && usadasNum < 100) {
        if (outputDiv.classList.contains("negative")) {
            outputDiv.classList.remove("negative");
        }
        result = ((totalNum - usadasNum).toFixed(1)).toString().replace(".", ",");
        if (result.includes("-")) {
            outputDiv.classList.add("negative");
        }
    }
    outputDiv.innerHTML = result
}

function _loadConvertionURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const total = urlParams.get('total');
    const usadas = urlParams.get('usadas');

    if (total) {
        document.getElementById("inputTotal").value = _epmToNumber(total);
    }

    if (usadas) {
        document.getElementById("inputUsadas").value = _epmToNumber(usadas);
    }

    if (total || usadas) {
        _loadConvertionHours();
    }
}