function _getCheckboxes() {
    let checkBoxes = {};
    switch (window.location.pathname) {
        case "/meuRH-visualizar.html":
            _loadCheckbox('checkboxEPM', checkBoxes);
            _loadCheckbox('checkboxFuturo', checkBoxes);
            _loadCheckbox('checkboxVazio', checkBoxes);
            break;
        case "/epm-visualizar.html":
            _loadCheckbox('checkboxMeuRH', checkBoxes);
            _loadCheckbox('checkboxVazio', checkBoxes);
            _loadCheckbox('checkboxFuturo', checkBoxes);
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
        const visibility = _getCheckboxVisibility(name);
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

function _getCheckboxVisibility(name) {
    let result = "block";
    switch (name) {
        case 'checkboxEPM':
            if (!_getLocal('epm')) {
                result = "none";
            }
            break;
        case 'checkboxFuturo':
        case 'checkboxVazio':
            break;
    }
    return result;
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
            case 'checkboxEPM':
                if (checkboxResult[key] == true) {
                    epm = _getLocal('epm');
                }
                break;
            case 'checkboxFuturo':
                if (checkboxResult[key] == false) {
                    today = new Date();
                }
                break;
            case 'checkboxVazio':
                break;
        }
    }

    let result = {
        start: "",
        end: "",
        meuRH: meuRH ? true : false,
        epm: epm ? true : false,
    }

    _loadPeriodo(result, meuRH, epm, today);

    return result;
}

function _loadPeriodo(result, meuRH, epm, today) {
    let startMeuRH;
    let endMeuRH;
    let startEPM;
    let endEPM;

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']) {
        startMeuRH = _getDate(meuRH['keypoints']['Início']);
        endMeuRH = _getDate(meuRH['keypoints']['Fim']);
    }

    if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']) {
        startEPM = _getDate(epm['keypoints']['Início']);
        endEPM = _getDate(epm['keypoints']['Fim']);
    }

    let start = _getEarliest(_getFilteredDateArray([startMeuRH, startEPM]));
    let end = _getLatest(_getFilteredDateArray([endMeuRH, endEPM]));

    if (today && today.getDate() < end.getDate()) {
        end = today;
    }

    result.start = start;
    result.end = end;

    return result;
}

function _getPeriodoString(periodo) {
    const start = _dateToDateStringNoYear(periodo.start);
    const end = _dateToDateStringNoYear(periodo.end);
    return start + " - " + end;
}
