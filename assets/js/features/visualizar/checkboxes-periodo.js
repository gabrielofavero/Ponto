function _loadCheckboxes() {
    const valManual = _getLocal('checkbox-manual', true)
    const valFuturo = _getLocal('checkbox-futuro', true)
    const valEpm = _getLocal('ignorar-dados-vazios', true);

    if (valManual !== undefined) {
        document.getElementById('checkbox-manual').checked = valManual;
    }

    if (valFuturo !== undefined) {
        document.getElementById('checkbox-futuro').checked = valFuturo;
    }

    if (valEpm !== undefined) {
        document.getElementById('ignorar-dados-vazios').checked = valEpm;
    }

    _loadCheckboxEventListeners();
}

function _loadCheckboxEventListeners() {
    const accordion = document.getElementById('accordion-filter');
    accordion.addEventListener('click', function () {
        _filterVisibility();
    });

    const checkboxManual = document.getElementById('checkbox-manual');
    checkboxManual.addEventListener('change', function (event) {
        localStorage.setItem('checkbox-manual', event.target.checked);
    });

    const checkboxFuturo = document.getElementById('checkbox-futuro');
    checkboxFuturo.addEventListener('change', function (event) {
        localStorage.setItem('checkbox-futuro', event.target.checked);
    });

    const checkboxEpm = document.getElementById('ignorar-dados-vazios');
    checkboxEpm.addEventListener('change', function (event) {
        localStorage.setItem('heckbox-apenas-epm', event.target.checked);
    });

    const filterApply = document.getElementById('filter-apply');
    filterApply.addEventListener('click', function () {
        window.location.reload();
    });
}

function _getCheckboxResult() {
    let result = {
        manual: false,
        futuro: false,
        epm: false
    };

    const checkboxManual = document.getElementById('checkbox-manual');
    const checkboxFuturo = document.getElementById('checkbox-futuro');
    const checkboxEpm = document.getElementById('ignorar-dados-vazios');

    const valManual = _getLocal('checkbox-manual', true) || checkboxManual.checked;
    const valFuturo = _getLocal('checkbox-futuro', true) || checkboxFuturo.checked;
    const valEpm = _getLocal('ignorar-dados-vazios', true) || checkboxEpm.checked;

    result.manual = valManual;
    result.futuro = valFuturo;
    result.epm = valEpm;

    return result;
}

function _getPeriodo(checkboxResult) {
    let result = {
        start: "",
        end: "",
    }

    const meuRH = _getLocal('meuRH');
    var epm;
    var manual;
    var today;

    if (checkboxResult.manual) {
        manual = _getLocal('manual-result');
    }

    if (!checkboxResult.futuro) {
        today = new Date();
    }

    if (checkboxResult.epm) {
        epm = _getLocal('epm');
    }

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
