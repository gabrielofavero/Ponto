const MESSAGE_DIVS_JSON = _getJSON('assets/json/visualizar/Message Divs.json');
const MESSAGES_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BUTTONS_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BADGES_JSON = _getJSON('assets/json/visualizar/Badges.json');
const PONTO_ITEM_JSON = _getJSON('assets/json/visualizar/Ponto Item.json');
var PERIODO;

// ==== Main ====
function _startVisualizar() {
    
    _loadCheckboxes();
    let checkboxResult = _getCheckboxResult();

    let regime = _getRegime();
    let saldo = _getSaldo();
    let periodo = _getPeriodo(checkboxResult);

    if (regime) {
        document.getElementById('regime').innerHTML = regime;
    }

    if (saldo) {
        document.getElementById('saldo').innerHTML = saldo;
    }

    if (periodo) {
        document.getElementById('periodo').innerHTML = _getPeriodoString(periodo);
    }

    const meuRH = _getLocal('meuRH');
    const epm = _getLocal('epm');
    const manual = _getLocal('manual-result');

    if (meuRH || epm || manual) {
        _loadPonto();
    }
    _endLoad();
}

// ==== Loaders ====
function _loadPonto() {
    const meuRH = _getLocal('meuRH');
    const epm = _getLocal('epm');
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
    const meuRH = _getLocal('meuRH');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']) {
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getFilteredDateArray(array) {
    var filteredArray = array.filter(function (value) {
        return value !== undefined;
    });
    return filteredArray;
}