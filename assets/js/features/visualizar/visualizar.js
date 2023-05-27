const MESSAGE_DIVS_JSON = _getJSON('assets/json/visualizar/Message Divs.json');
const MESSAGES_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BUTTONS_JSON = _getJSON('assets/json/visualizar/Messages.json');
const BADGES_JSON = _getJSON('assets/json/visualizar/Badges.json');
const PONTO = _getJSON('assets/json/visualizar/Ponto.json');
var PERIODO;

// ==== Main ====
function _startVisualizar(type) {
    let checkBoxes = _getCheckboxes();;
    let database = "";

    if (type == 'meuRH'){
        let regime = _getRegime();
        let saldo = _getSaldo();
    
        if (regime) {
            document.getElementById('regime').innerHTML = regime;
        }
    
        if (saldo) {
            document.getElementById('saldo').innerHTML = saldo;
        }
        database = _getLocal('meuRH');
    } else if (type == 'epm'){
        database = _getLocal('epm');
    }

    let periodo = _getPeriodo(checkBoxes, type);
    
    if (periodo) {
        document.getElementById('periodo').innerHTML = _getPeriodoString(periodo);
        if ((new Date()).getTime() >= periodo.end.getTime()){
            _unloadCheckbox('checkboxFuturo', checkBoxes);
        }
    }

    if (database) {
        _loadPonto(checkBoxes, type, database.system);
    }
    _endLoad();
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

function _getCheckboxes() {
    let checkBoxes = {};
    let ids;
    switch (window.location.pathname) {
        case "/meuRH-visualizar.html":
            _loadCheckbox('checkboxEPM', checkBoxes);
            _loadCheckbox('checkboxFuturo', checkBoxes);
            _loadCheckbox('checkboxVazio', checkBoxes);
            ids = ['checkboxEPM', 'checkboxFuturo', 'checkboxVazio'];
            break;
        case "/epm-visualizar.html":
            _loadCheckbox('checkboxMeuRH', checkBoxes);
            _loadCheckbox('checkboxVazio', checkBoxes);
            _loadCheckbox('checkboxFuturo', checkBoxes);
            ids = ['checkboxMeuRH', 'checkboxVazio', 'checkboxFuturo'];
            break;
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

function _loadCheckbox(name, checkBoxes) {
    const val = _getLocal(name, true);
    const div = document.getElementById(name);
    const itemDiv = document.getElementById(name + '-item');

    if (div && itemDiv) {
        let visibility;
        if ((name == 'checkboxEPM' && !_getLocal('epm')) || (name == 'checkboxMeuRH' && !_getLocal('meuRH'))) {
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
    // remove event listener
    div.removeEventListener('change', function (event) {
        localStorage.setItem(name, event.target.checked);
    });
}

function _getPeriodo(checkboxResult, type) {
    var meuRH = type == 'meuRH' ? _getLocal('meuRH') : undefined;
    var epm = type == 'epm' ? _getLocal('epm') : undefined;
    var today;

    const keys = Object.keys(checkboxResult);

    for (let key of keys) {
        switch (key) {
            case 'checkboxMeuRH':
                if (checkboxResult[key] == true) {
                    meuRH = _getLocal('meuRH');
                }
                break;
            case 'checkboxEPM':
                if (checkboxResult[key] == true) {
                    epm = _getLocal('epm');
                }
                break;
            case 'checkboxFuturo':
                if (checkboxResult[key] == false) {
                    today = new Date();
                }
        }
    }

    let result = {
        start: "",
        end: "",
    }

    let start;
    let end;

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']) {
        start = _getDate(meuRH['keypoints']['Início']);
        end = _getDate(meuRH['keypoints']['Fim']);
    } else if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']) {
        start = _getDate(epm['keypoints']['Início']);
        end = _getDate(epm['keypoints']['Fim']);
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
