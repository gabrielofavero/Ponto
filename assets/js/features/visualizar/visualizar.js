const MESSAGE_DIVS_JSON = _getJSON('assets/json/visualizar/Message Divs.json');
const MESSAGES_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BUTTONS_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BADGES_JSON = _getJSON('assets/json/visualizar/Badges.json');
const PONTO_JSON = _getJSON('assets/json/visualizar/Ponto.json');
const REGIMES_JSON = _getJSON('assets/json/visualizar/Regimes.json');
var PERIODO;

// === Main Function ===
function _startVisualizar(type) {
    _loadVisualizarEventListeners();
    let checkBoxes = _getCheckboxes(type);;
    let database = "";

    if (type == 'meuRH') {
        let regime = _getRegime();
        let saldo = _getSaldo();

        if (regime) {
            document.getElementById('regime').innerHTML = regime;
        }

        if (saldo) {
            document.getElementById('saldo').innerHTML = saldo;
        }
        database = _getLocal('meuRH');
    } else if (type == 'epm') {
        database = _getLocal('epm');
    }

    let periodo = _getPeriodo(checkBoxes, type);
    let periodoString = "";

    if (periodo) {
        periodoString = _getPeriodoString(periodo);
        document.getElementById('periodo').innerHTML = periodoString;
    }

    if (database) {
        _loadPonto(checkBoxes, type, database.system);
    }

    _updatePeriodoString(periodoString);
    _endLoad();
}

// === Loaders ===

function _loadCheckbox(name, checkBoxes) {
    const val = _getLocal(name, true);
    const div = document.getElementById(name);
    const itemDiv = document.getElementById(name + '-item');

    if (div && itemDiv) {
        let visibility;
        const meuRH = _getLocal('meuRH');
        const epm = _getLocal('epm');
        const compare = _getLocal("compare");
        const meuRHCheck = name == 'checkboxMeuRH' && (!meuRH || !_isVersionValid(meuRH) || !compare);
        const epmCheck = name == 'checkboxEPM' && (!epm || !_isVersionValid(epm) || !compare);
        if (meuRHCheck || epmCheck) {
            visibility = "none";
        } else {
            visibility = "block";
        }

        itemDiv.style.display = visibility;
        if (visibility != "none") {
            if (itemDiv.style.display)
                if (val !== undefined) {
                    div.checked = val;
                }

            div.addEventListener('change', function (event) {
                localStorage.setItem(name, event.target.checked);
            });
            checkBoxes[name] = val || div.checked;
        }
    }
}

function _unloadCheckbox(name, checkBoxes) {
    delete checkBoxes[name];
    localStorage.removeItem(name);
    const div = document.getElementById(name);
    const itemDiv = document.getElementById(name + '-item');
    if (div && itemDiv) {
        itemDiv.style.display = "none";
    }
    div.removeEventListener('change', function (event) {
        localStorage.setItem(name, event.target.checked);
    });
}

function _loadVisualizarEventListeners() {
    _resizeRegime();
}

// === Getters ===
function _getRegime() {
    let job = _getLocal('job');
    if (job) {
        if ((job.toLowerCase().includes('estagiario'))) {
            job = REGIMES_JSON.estagio;
        } else {
            job = REGIMES_JSON.comum;
        }
    }
    return job;
}

function _getSaldo() {
    const meuRH = _getLocal('meuRH');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']) {
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getCheckboxes(type) {
    let checkBoxes = {};

    if (type == 'meuRH') {
        _loadCheckbox('checkboxEPM', checkBoxes);
        _loadCheckbox('checkboxVazio', checkBoxes);
        ids = ['checkboxEPM', 'checkboxVazio'];
    } else if (type == 'epm') {
        _loadCheckbox('checkboxMeuRH', checkBoxes);
        _loadCheckbox('checkboxVazio', checkBoxes);
        ids = ['checkboxMeuRH', 'checkboxVazio'];
    }

    const accordion = document.getElementById('accordion-filter');
    accordion.addEventListener('click', function () {
        _filterVisibility();
    });

    const filterApply = document.getElementById('filter-apply');
    filterApply.addEventListener('click', function () {
        window.location.reload();
    });

    return checkBoxes;
}

function _getPeriodo(checkBoxes, type) {
    var meuRH = type == 'meuRH' ? _getLocal('meuRH') : undefined;
    var epm = type == 'epm' ? _getLocal('epm') : undefined;
    var today;

    const keys = Object.keys(checkBoxes);
    for (let key of keys) {
        switch (key) {
            case 'checkboxMeuRH':
                if (checkBoxes[key] == true) {
                    meuRH = _getLocal('meuRH');
                }
                break;
            case 'checkboxEPM':
                if (checkBoxes[key] == true) {
                    epm = _getLocal('epm');
                }
                break;
        }
    }
    let result = {
        start: "",
        end: "",
    }

    let start;
    let end;

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']) {
        start = _dateStringToDate(meuRH['keypoints']['Início']);
        end = _dateStringToDate(meuRH['keypoints']['Fim']);
    } else if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']) {
        start = _dateStringToDate(epm['keypoints']['Início']);
        end = _dateStringToDate(epm['keypoints']['Fim']);
    }

    result.start = start;
    result.end = today ? _getEarliest([end, today]) : end;

    return result;
}

function _getPeriodoString(periodo) {
    const start = _dateToDateStringNoYear(periodo.start);
    const end = _dateToDateStringNoYear(periodo.end);
    return start + " - " + end;
}

// === Setters ===
function _updatePeriodoString(periodoString) {
    const start = periodoString.split(" - ")[0];
    const end = periodoString.split(" - ")[1];
    const dates = _getAllIdsInClass("dateBox").sort((a, b) => a - b);
    const startHTML = document.getElementById(dates[0]).innerHTML.trim();
    const endHTML = document.getElementById(dates[dates.length - 1]).innerHTML.trim();

    if (start != startHTML || end != endHTML) {
        periodoString = startHTML + " - " + endHTML;
        document.getElementById('periodo').innerHTML = periodoString;
    }
}

function _resizeRegime() {
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var regimeTitle = document.getElementById('regimeTitle');
        if (regimeTitle) {
            if (width < 484 || (width < 1400 && width >= 1200)) {
                regimeTitle.innerHTML = 'Modelo';
            } else {
                regimeTitle.innerHTML = 'Modelo de Trabalho';
            }
        }
    });
    window.dispatchEvent(new Event('resize'));
}