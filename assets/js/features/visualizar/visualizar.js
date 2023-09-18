const MESSAGE_DIVS_JSON = _getJSON('assets/json/visualizar/Message Divs.json');
const MESSAGES_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BUTTONS_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BADGES_JSON = _getJSON('assets/json/visualizar/Badges.json');
const PONTO_JSON = _getJSON('assets/json/visualizar/Ponto.json');
var PERIODO;

// === Main Function ===
function _startVisualizar(type) {
    _loadVisualizarEventListeners();
    let checkBoxes = _getCheckboxes(type);;
    let database = "";

    let regime = _getRegime();
    if (regime) {
        document.getElementById('regime').innerHTML = regime;
    }

    if (type == 'meuRH') {
        let saldo = _getSaldo();
        if (saldo) {
            document.getElementById('saldo').innerHTML = saldo;
        }
    } 

    database = _getLocal(type);

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

    if (!regimeFound) {
        $(document).ready(function() {
            $('#regimeModal').modal('show');
        });
    }
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

            _loadCheckBoxVazioEPM((name));
            div.addEventListener('change', function (event) {
                localStorage.setItem(name, event.target.checked);
                _loadCheckBoxVazioEPM((name));

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
    document.getElementById('regimeSaveManual').addEventListener('click', function () {
        _saveManualRegime()
    });
}

function _loadCheckBoxVazioEPM(name) {
    if (name == 'checkboxEPM' || name == 'checkboxMeuRH') {
        const type = name.replace('checkbox', "");
        const checked = document.getElementById(name).checked;
        const epmEmpty = document.getElementById(`checkboxVazio${type}-item`);
        if (epmEmpty && checked) {
            epmEmpty.classList.add('visible');
        } else if (epmEmpty && !checked) {
            epmEmpty.classList.remove('visible');
        }
    }
}

// === Getters ===
function _getSaldo() {
    const meuRH = _getLocal('meuRH');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']) {
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getCheckboxes(type) {
    let checkBoxes = {};

    if (type == 'meuRH') {
        _loadCheckbox('checkboxVazio', checkBoxes);
        _loadCheckbox('checkboxEPM', checkBoxes);
        _loadCheckbox('checkboxVazioEPM', checkBoxes);
    } else if (type == 'epm') {
        _loadCheckbox('checkboxMeuRH', checkBoxes);
        _loadCheckbox('checkboxVazio', checkBoxes);
        _loadCheckbox('checkboxVazioMeuRH', checkBoxes);
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

    if (dates.length > 0) {
        const startHTML = document.getElementById(dates[0]).innerHTML.trim();
        const endHTML = document.getElementById(dates[dates.length - 1]).innerHTML.trim();

        if (start != startHTML || end != endHTML) {
            periodoString = startHTML + " - " + endHTML;
            document.getElementById('periodo').innerHTML = periodoString;
        }
    } else {
        document.getElementById('accordion-items').innerHTML = MESSAGE_DIVS_JSON.info.replace('#1', MESSAGES_JSON.noDataFilter);
    }

}

