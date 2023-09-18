var convertions = []


// === Main Function ===
function _startConversores() {
    const inputTime = document.getElementById('inputTime');
    const inputEPM = document.getElementById('inputEPM');
    const addConvertionButton = document.getElementById('add-converter-button');

    const visualizarBox = document.getElementById('visualizarBox');
    visualizarBox.addEventListener('input', (event) => {
    if (event.target.classList.contains('conversor')) {
        _loadConvertionHours(event.target.id);
    }
    });

    _loadConvertionURLParameters();

    inputTime.addEventListener('input', (event) => {
        _loadTimeToEPM(event.target.value);
    });

    inputEPM.addEventListener('input', (event) => {
        _loadEPMToTime(event.target.value);
    });

    addConvertionButton.addEventListener('click', (event) => {
        _addConvertion();
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

function _loadConvertionHours(inputID) {
    const i = inputID.replace(/[^0-9]/g, '');

    const totalVal = document.getElementById(`inputTotal${i}`).value;
    const usadasVal = document.getElementById(`inputUsadas${i}`).value;
    const outputDiv = document.getElementById(`outputRestante${i}`);

    convertions[i] = [totalVal, usadasVal];

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

function _addConvertion() {
    convertions.push([]);
    const i = convertions.length - 1;

    visualizarBox.innerHTML += `
    <div class="card-body visualizar" id="visualizar${i}">
        <div id="conversorHoras1" class="inner-card-body conversor-item-1">
            <input id="inputTotal${i}" type="number" step="0.1" min="0" max="100" placeholder="-,-" class="form-control conversor input">
        </div>
        <div id="conversorHoras2" class="inner-card-body conversor-item-2">
            <input id="inputUsadas${i}" type="number" step="0.1" min="0" max="100" placeholder="-,-" class="form-control conversor input">
        </div>
        <div class="inner-card-body">
            <div class="inner-card-value output" id="outputRestante${i}">0,0</div>
        </div>
    </div>
    `;

    _reloadConvertionValues();

    const previous = document.getElementById(`outputRestante${i-1}`).innerText.replace(",", ".");
    document.getElementById(`inputTotal${i}`).value = previous;
    _loadConvertionHours(`inputTotal${i}`);
}

function _reloadConvertionValues() {
    for (let i = 0; i < convertions.length; i++) {
        if (convertions[i].length) {
            const total = convertions[i][0];
            const usadas = convertions[i][1];
            if (total) {
                document.getElementById(`inputTotal${i}`).value = total;
            }
            if (usadas) {
                document.getElementById(`inputUsadas${i}`).value = usadas;
            }
        }
    }
}
