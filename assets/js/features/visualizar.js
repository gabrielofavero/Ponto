const MESSAGE_DIVS = {
    manual: `<div class="alert alert-primary item-mensagem" role="alert"><i class="bi bi-pencil me-1"></i> #1</div>`,
    info: `<div class="alert alert-secondary item-mensagem" role="alert"><i class="bi bi-info-circle me-1"></i> #1</div>`,
    warning: `<div class="alert alert-warning item-mensagem" role="alert"><i class="bi bi-exclamation-triangle me-1"> #1</i></div>`
}

const MESSAGES = {
    manual: "Alguns dados foram editados manualmente. Atualize também no <b>MeuRH / EPM</b>",
    meuRHMissing: "Não é possível comparar com o <b>Meu RH</b> pois não existem dados para essa data.",
    epmMissing: "Não é possível comparar com o <b>EPM</b> pois não existem dados para essa data.",
    noMatch: "Os horários do <b>Meu RH</b> e <b>EPM</b> não batem.",
    noInterval: "Você trabalhou mais de 6 horas, mas não regitrou um intervalo de 1 a 2 horas.",
    noMainInterval: "Apesar de você ter feito um intervalo, ele não está entre <b>01:00 a 02:00</b>.",
    noMainIntervals: "Apesar de ter feito intervalos, nenhum deles está entre <b>01:00 a 02:00</b>.",
    odd: "Você marcou um número ímpar de batidas. Realize o ajuste manual para incluir o horário ausente.",
    tooLongJourney: "Você trabalhou mais de 10 horas. Só é autorizado trabalhar até 2h extras por dia.",
    internJourneyMismatch: "Você não trabalhou 6 horas. Estagiários devem trabalhar exatamente 6 horas por dia.",
}

const BUTTONS = {
    edit: {
        type: "primary",
        text: `<button type="button" class="btn btn-primary first-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Editar"><i class="bi bi-pencil"></i></button>`
    },
    delete: {
        type: "warning",
        text: `<button type="button" class="btn btn-warning first-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Excluir"><i class="bi bi-trash"></i></button>`
    },
    add: {
        type: "success",
        text: `<button type="button" class="btn btn-success first-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Novo Dia"><i class="bi bi-plus-circle"></i></button>`
    },
    cancel: {
        type: "danger",
        text: `<button type="button" class="btn btn-danger first-button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-original-title="Cancelar"><i class="bi bi-x-circle"></i></button>`
    }
}

var messages = [];

const BADGES = {
    success: {
        badge: "success",
        roundedPill: "badge rounded-pill bg-success",
        icon: "bi bi-check-circle"
    },
    warning: {
        badge: "warning",
        roundedPill: "badge rounded-pill bg-warning text-dark",
        icon: "bi bi-exclamation-triangle"
        
    },
    danger: {
        badge: "danger",
        roundedPill: "badge rounded-pill bg-danger",
        icon: "bi bi-exclamation-octagon"
    },
    info: {
        badge: "secondary",
        roundedPill: "badge rounded-pill bg-secondary",
        icon: "bi bi-info-circle"
    },
    manual: {
        badge: "primary",
        roundedPill: "badge rounded-pill bg-primary",
        icon: "bi bi-pencil"
    },
    common: {
        badge: "common",
        roundedPill:"common",
        icon: ""
    }
}

const PONTO = {
    key: "",
    i: 0,
    date: "",
    title: {
        roundedPill: BADGES.success.roundedPill,
        badge: BADGES.success.badge,
        value: "00:00",
        icon: BADGES.success.icon,
        textType: ""
    },
    hours: {
        roundedPill: BADGES.info.roundedPill,
        badge: BADGES.info.badge,
        value: "",
        icon: BADGES.info.icon
    },
    interval: {
        roundedPill: "",
        value: ""
    },
    punchesTableHTML: "",
    meuRH: {
        roundedPill: BADGES.info.roundedPill,
        value: "?"
    },
    epm: {
        roundedPill: BADGES.info.roundedPill,
        value: "?"
    },
    messagesHTML: ""
};


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

    let start = _getEarliest(_filterDatesArray([startMeuRH, startEPM, startManual]));
    let end = _getLatest(_filterDatesArray([endMeuRH, endEPM, endManual]));

    result.start = _dateToDateStringNoYear(start);
    result.end = _dateToDateStringNoYear(end);

    return result;
}

function _getPeriodoString() {
    let periodo = _getPeriodo();
    return periodo.start + " - " + periodo.end;
}

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

function _loadPontoItem(i, key) {
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    if ((meuRH && meuRH['system'][key]) || (epm && epm['system'][key]) || (manual && manual['system'][key])) {
        let ponto = JSON.parse(JSON.stringify(PONTO));
        ponto.key = key;
        ponto.i = i;
        messages = [];

        // Date
        _loadPontoDate(ponto);

        // Meu RH
        _loadPontoItemMeuRH(ponto);
        _validatePontoValue(ponto, "meuRH");

        // EPM
        _loadPontoItemEPM(ponto);
        _validatePontoValue(ponto, "epm");

        // Meu RH and EPM Comparison
        _validateMeuRHAndEPM(ponto);
         
        // Messages HTML
        _loadMessagesHTML(ponto);

        // Apply to HTML
        _loadAccordionItemHTML(ponto)
        _setAccordionVisibility(i);
    }
}

function _loadPontoDate(ponto){
    const dateNoYear = _dateStringToDateStringNoYear(ponto.key);
    const dayOfTheWeek = _getDayOfTheWeek(ponto.key);
    ponto.date = `${dateNoYear}<div class="dayOfTheWeek"> ${dayOfTheWeek}</div>`
}

function _loadPontoItemMeuRH(ponto){
    const meuRH = _getLocal('meuRH-result');
    if (meuRH && meuRH['system'][ponto.key]) {
        const punches = _calculatePunches(meuRH['system'][ponto.key], messages);

        ponto.punchesTableHTML = _getPunchesTableHTML(meuRH['system'][ponto.key], messages, ponto.i);
    
        ponto.hours.value = punches.hours.value;
        ponto.hours.roundedPill = punches.hours.roundedPill;
        ponto.hours.badge = punches.hours.badge;
        ponto.hours.icon = punches.hours.icon;
    
        ponto.interval.value = punches.interval.value;
        ponto.interval.roundedPill = punches.interval.roundedPill;
        ponto.interval.icon = punches.interval.icon;
    
        ponto.title.value = punches.hours.value;
        ponto.meuRH.value = _timeToEPM(punches.hours.value);
    }
}

function _loadPontoItemEPM(ponto){
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');
    if (epm && epm['system'][ponto.key]) {
        if ((!meuRH || !meuRH['system'][ponto.key]) && (!manual || !manual['system'][ponto.key])){
            _loadPontoItemEPMExclusive(ponto);
        } else {
            ponto.epm.value = epm['system'][ponto.key];
        }
    }
}

function _loadPontoItemEPMExclusive(ponto){

}

function _loadAccordionItemHTML(ponto) {
    let result = `
    <div class="accordion-item">
    <h2 class="accordion-header" id="heading${ponto.i}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse${ponto.i}" aria-expanded="false" aria-controls="collapse${ponto.i}">
        ${ponto.date} <span class="badge bg-${ponto.title.badge} time-badge ${ponto.title.textType}" id="badge${ponto.i}"><i class="${ponto.title.icon} me-1"></i>
          ${ponto.title.value}</span>
      </button>
    </h2>
    <div id="collapse${ponto.i}" class="accordion-collapse collapse" aria-labelledby="heading${ponto.i}"
      data-bs-parent="#ponto-accordion">
      <div class="accordion-body">

        <div class="item-comparison-container" id="comparison-container${ponto.i}">
          <div class="item-comparison-table">
            <div class="item-internal-container">
              <div class="item-comparison-title">Trabalho</div>
              <div><span class="${ponto.hours.roundedPill}">${ponto.hours.value}</span></div>
            </div>
            <div class="item-internal-container">
              <div class="item-comparison-title">Intervalo</div>
              <div><span class="${ponto.interval.roundedPill}">${ponto.interval.value}</span></div>
            </div>
          </div>
        </div>

        <div class="item-comparison-container" id="punchesTable${ponto.i}">
        ${ponto.punchesTableHTML}
        </div>

        <div class="item-comparison-container">
          <div class="item-comparison-table">
            <div class="item-internal-container">
              <div class="item-comparison-title">Meu RH</div>
              <div><span class="${ponto.meuRH.roundedPill}">${ponto.meuRH.value}</span></div>
            </div>
            <div class="item-internal-container">
              <div class="item-comparison-title">EPM</div>
              <div><span class="${ponto.epm.roundedPill}">${ponto.epm.value}</span></div>
            </div>
          </div>
        </div>

        <div class="item-internal-messages" id="message${ponto.i}">
            ${ponto.messagesHTML}
        </div>

      </div>
    </div>
  </div>`

    document.getElementById("accordion-items").innerHTML += result;
}

function _validatePontoValue(ponto, value){
    if (value == "meuRH" || value == "epm") {
        if (ponto[value].value == "?") {
            messages.push(MESSAGES[`${value}Missing`]);
        } else {
            ponto.meuRH.roundedPill = BADGES.common.roundedPill;
        }
    }
}

function _validateMeuRHAndEPM(ponto){
    if (ponto.meuRH.value != "?" && ponto.epm.value != "?" && ponto.meuRH.value != ponto.epm.value) {
        ponto.meuRH.roundedPill = BADGES.warning.roundedPill;
        ponto.epm.roundedPill = BADGES.warning.roundedPill;
        messages.push(MESSAGES.noMatch);
    }
}

function _getPunchesTableHTML(punchesArray, messages, i) {
    if (punchesArray.length % 2 != 0) {
        punchesArray.push('?')
    }
    let entradas = [];
    let saidas = [];
    let batidas;

    for (let j = 0; j < punchesArray.length; j++) {
        let value = `<span class="#1" id="#2">${punchesArray[i]}</span>`

        if (punchesArray[j] == "?") {
            value = value.replace('#1', BADGES.warning.roundedPill);
        } else {
            value = value.replace('#1', BADGES.common.badge);
        }

        if (j % 2 == 0) {
            value = value.replace('#2', `e-${i}-${j}`);
            entradas.push(value);
        } else {
            value = value.replace('#2', `s-${i}-${j}`);
            saidas.push(value);
        }
    }

    // Batidas
    if (punchesArray.length % 2 == 0) {
        batidas = `<span class="common">${punchesArray.length}</span>`
    } else {
        messages.push(MESSAGES.odd);
        batidas = `<span class="${BADGES.warning.roundedPill}">${punchesArray.length}</span>`
    }

    return `
    <div class="item-comparison-table">
    <div class="item-internal-container">
      <div class="item-comparison-title">Entrada</div>
        <div id="entradas${i}">
            ${entradas.join('')}
        </div>
    </div>
    <div class="item-internal-container">
      <div class="item-comparison-title">Saída</div>
        <div id="saidas${i}">
            ${saidas.join('')}
        </div>
    </div>
  </div>
  <div class="item-internal-footer">
    <span class="item-comparison-title">Batidas: </span>${batidas}
  </div>
    `
}

function _calculatePunches(array, messages) {
    let hArray = [];
    let iArray = [];
    let result = {
        hours: {
            badge: BADGES.common.badge,
            roundedPill: BADGES.common.roundedPill,
            icon: BADGES.common.icon,
            value: "00:00"
        },
        interval: {
            roundedPill: BADGES.common.roundedPill,
            icon: BADGES.common.icon,
            value: "00:00"
        },
    }

    if (array.length > 1) {
        for (let i = 1; i < array.length; i++) {
            let time1 = array[i - 1];
            let time2 = array[i]
            let difference = _timeDifference(time1, time2);

            if (i % 2 != 0) {
                hArray.push(difference);
            } else {
                iArray.push(difference);
            }
        }
        result.hours.value = _sumTime(hArray);
        result.interval.value = _sumTime(iArray);

        result.hours.badge = _getHoursBadge(result.hours.value, messages);
        result.hours.roundedPill = _getHoursRoundedPill(result.hours.badge);
        result.hours.icon = _getIcon(result.hours.badge);

        result.interval.roundedPill = _getIntervalRoundedPill(result.hours.value, iArray, messages);
        result.interval.icon = _getIcon(result.interval.badge);
    }
    return result;
}

function _getHoursBadge(hours, messages) {
    const regime = _getRegime();
    if (regime == "CLT" && _isTimeStringBiggerThen(hours, "10:00")) {
        messages.push(MESSAGES.tooLongJourney);
        return BADGES.warning.badge;
    } else if (regime == "Estagiário" && hours != "06:00") {
        messages.push(MESSAGES.internJourneyMismatch);
        return BADGES.warning.badge;
    } else {
        return BADGES.common.badge;
    }
}

function _getHoursRoundedPill(badge){
    switch (badge){
        case BADGES.warning.badge:
            return BADGES.warning.roundedPill;
        case BADGES.danger.badge:
            return BADGES.danger.roundedPill;
        case BADGES.success.badge:
            return BADGES.success.roundedPill;  
        case BADGES.info.badge:
            return BADGES.info.roundedPill;
        default:
            return BADGES.common.roundedPill;
    }
}

function _getIcon(badge){
    switch (badge){
        case BADGES.warning.badge:
            return BADGES.warning.icon;
        case BADGES.danger.badge:
            return BADGES.danger.icon;
        case BADGES.success.badge:
            return BADGES.success.icon;  
        case BADGES.info.badge:
            return BADGES.info.icon;
        default:
            return BADGES.common.icon;
    }
}

function _getIntervalRoundedPill(hours, iArray, messages) {
    result = BADGES.common.roundedPill;
    if (_isTimeStringBiggerThen(hours, "06:00")) {
        switch (iArray.length) {
            case 0:
                result = BADGES.warning.roundedPill;
                messages.push(MESSAGES.noInterval);
                break;
            case 1:
                if (!_isTimeStringBiggerThen(iArray[0], "01:00") || _isTimeStringBiggerThen(iArray[0], "02:00")) {
                    result = BADGES.warning.roundedPill;
                    messages.push(MESSAGES.noMainInterval);
                }
                break;
            default:
                for (let i = 0; i < iArray.length; i++) {
                    let hasMainInterval = false;
                    if (_isTimeStringBiggerThen(iArray[i], "01:00") && !_isTimeStringBiggerThen(iArray[i], "02:00")) {
                        hasMainInterval = true;
                        break;
                    }
                    if (!hasMainInterval){
                        result = BADGES.warning.roundedPill;
                        messages.push(MESSAGES.noMainIntervals);
                    }
                }
        }
    }
    return result;
}

function _filterDatesArray(array) {
    var filteredArray = array.filter(function (value) {
        return value !== undefined;
    });
    return filteredArray;
}

function _setAccordionVisibility(i) {
    let eSize = 0;
    let sSize = 0;

    while (document.getElementById(`e-${i}-${eSize}`)) {
        eSize++;
    }

    while (document.getElementById(`s-${i}-${sSize}`)) {
        sSize++;
    }

    if (!eSize && !sSize) {
        document.getElementById(`punchesTable${i}`).style.display = "none";
    }
}

function _loadMessagesHTML(ponto) {
    let result = [];
    let types = [];
    for (let message of messages){
        let messageDiv;
        switch (message) {
            case MESSAGES.manual:
                messageDiv = MESSAGE_DIVS.manual;
                types.push(BADGES.manual.badge);
                break;
            case MESSAGES.meuRHMissing:
            case MESSAGES.epmMissing:
                messageDiv = MESSAGE_DIVS.info;
                types.push(BADGES.info.badge);
                break;
            case "":
            case undefined:
            case null:
                break;
            default:
                messageDiv = MESSAGE_DIVS.warning;
                types.push(BADGES.warning.badge);
        }
        if (messageDiv){
            result.push(messageDiv.replace("#1", message));
        }
    }
    ponto.messagesHTML = result.join("");
    let typesS = types.toString();

    if (typesS.includes(BADGES.danger.badge)){
        ponto.title.badge = BADGES.danger.badge;
        ponto.title.icon = BADGES.danger.icon;
    } else if (typesS.includes(BADGES.warning.badge)){
        ponto.title.badge = BADGES.warning.badge;
        ponto.title.icon = BADGES.warning.icon;
        ponto.title.textType = "text-dark";
    } else if (typesS.includes(BADGES.info.badge)){
        ponto.title.badge = BADGES.info.badge;
        ponto.title.icon = BADGES.info.icon;
    }
}