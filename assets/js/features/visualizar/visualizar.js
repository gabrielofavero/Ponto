const MESSAGE_DIVS_JSON = _getJSON('assets/json/visualizar/Message Divs.json');
const MESSAGES_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BUTTONS_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BADGES_JSON = _getJSON('assets/json/visualizar/Badges.json');
const PONTO_ITEM_JSON = _getJSON('assets/json/visualizar/Ponto Item.json');

// ==== Main ====
function _startVisualizar() {
    let regime = _getRegime();
    let saldo = _getSaldo();
    let periodo = _getPeriodo();

    if (regime) {
        document.getElementById('regime').innerHTML = regime;
    }

    if (saldo) {
        document.getElementById('saldo').innerHTML = saldo;
    }

    if (periodo) {
        document.getElementById('periodo').innerHTML = _getPeriodoString();
    }

    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    if (meuRH || epm || manual) {
        _loadPonto();
    }
}

// ==== Loaders ====
function _loadPonto() {
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    let keysMeuRH = [];
    let keysEPM = [];
    let keysManual = [];

    if (meuRH) {
        keysMeuRH = Object.keys(meuRH['system']);
    }

    if (epm) {
        keysEPM = Object.keys(epm['system']);
    }

    if (manual) {
        keysManual = Object.keys(manual['system']);
    }

    let keys = [...new Set(keysMeuRH.concat(keysEPM, keysManual))];

    keys.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'));
        const dateB = new Date(b.split('/').reverse().join('/'));
        return dateA - dateB;
    });

    for (let i = 0; i < keys.length; i++) {
        _loadPontoItem(i, keys[i]);
    }
}

// ==== Getters ====
function _getRegime() {
    let job = _getLocal('job');
    if (job && (job.toLowerCase().includes('estagiario'))) {
        job = 'Estagiário';
    } else {
        job = 'CLT';
    }
    return job;
}

function _getSaldo() {
    const meuRH = _getLocal('meuRH-result');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']) {
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getPeriodo() {
    let result = {
        start: "",
        end: ""
    }
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    let startMeuRH;
    let endMeuRH;
    let startEPM;
    let endEPM;
    let startManual;
    let endManual;

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']) {
        startMeuRH = _getDate(meuRH['keypoints']['Início']);
        endMeuRH = _getDate(meuRH['keypoints']['Fim']);
    }

    if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']) {
        startEPM = _getDate(epm['keypoints']['Início']);
        endEPM = _getDate(epm['keypoints']['Fim']);
    }

    if (manual && manual['keypoints'] && manual['keypoints']['Início'] && manual['keypoints']['Fim']) {
        startManual = _getDate(manual['keypoints']['Início']);
        endManual = _getDate(manual['keypoints']['Fim']);
    }

    let start = _getEarliest(_getFilteredDateArray([startMeuRH, startEPM, startManual]));
    let end = _getLatest(_getFilteredDateArray([endMeuRH, endEPM, endManual]));

    result.start = _dateToDateStringNoYear(start);
    result.end = _dateToDateStringNoYear(end);

    return result;
}

function _getPeriodoString() {
    let periodo = _getPeriodo();
    return periodo.start + " - " + periodo.end;
}

function _getFilteredDateArray(array) {
    var filteredArray = array.filter(function (value) {
        return value !== undefined;
    });
    return filteredArray;
}