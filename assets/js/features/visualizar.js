const MESSAGE_DIVS = {
    manual: `<div class="alert alert-primary item-mensagem" role="alert"><i class="bi bi-pencil me-1"></i>#1</div>`,
    info: `<div class="alert alert-secondary item-mensagem" role="alert"><i class="bi bi-info-circle me-1"></i>#1</div>`,
    warning: `<div class="alert alert-warning item-mensagem" role="alert"><i class="bi bi-exclamation-triangle me-1"></i></div>`
}

const MESSAGES = {
    manual: "Alguns dados foram editados manualmente. Atualize também no <b>MeuRH / EPM</b>",
    noMeuRH: "Não é possível comparar com o <b>Meu RH</b> pois não existem dados para essa data.",
    noEPM: "Não é possível comparar com o <b>EPM</b> pois não existem dados para essa data.",
    noMatch: "Os horários do <b>Meu RH</b> e <b>EPM</b> não batem.",
    noInterval: "Você trabalhou mais de 6 horas, mas não regitrou um intervalo de 1 a 2 horas.",
    noMainInterval: "Apesar de ter feito um intervalo, ele não possui entre 1 a 2 horas.",
    noMainIntervals: "Apesar de ter feito intervalos, nenhum deles possui entre 1 a 2 horas.",
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

const BADGES = {
    success: {
        type: "success",
        roundedPill: "badge rounded-pill bg-success",
        icon: "bi bi-check-circle"
    },
    warning: {
        type: "warning",
        roundedPill: "badge rounded-pill bg-warning",
        icon: "bi bi-exclamation-triangle"
    },
    danger: {
        type: "danger",
        roundedPill: "badge rounded-pill bg-danger",
        icon: "bi bi-exclamation-octagon"
    },
    info: {
        type: "info",
        roundedPill: "badge rounded-pill bg-info",
        icon: "bi bi-info-circle"
    }
}


function _startVisualizar(){
    let regime = _getRegime();
    let saldo = _getSaldo();
    let periodo = _getPeriodo();

    if (regime){
        document.getElementById('regime').innerHTML = regime;
    }

    if (saldo){
        document.getElementById('saldo').innerHTML = saldo;
    }

    if (periodo){
        document.getElementById('periodo').innerHTML = _getPeriodoString();
    }

    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    if (meuRH || epm || manual){
        _loadPonto();
    }

}

function _getRegime(){
    let job = _getLocal('job');
    if(job && (job.toLowerCase().includes('estagiario'))){
        job = 'Estagiário';
    } else {
        job = 'CLT';
    }
    return job;
}

function _getSaldo(){
    const meuRH = _getLocal('meuRH-result');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']){
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getPeriodo(){
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

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']){
        startMeuRH = _getDate(meuRH['keypoints']['Início']);
        endMeuRH = _getDate(meuRH['keypoints']['Fim']);
    }

    if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']){
        startEPM = _getDate(epm['keypoints']['Início']);
        endEPM = _getDate(epm['keypoints']['Fim']);
    }

    if (manual && manual['keypoints'] && manual['keypoints']['Início'] && manual['keypoints']['Fim']){
        startManual = _getDate(manual['keypoints']['Início']);
        endManual = _getDate(manual['keypoints']['Fim']);
    }

    let start = _getEarliest(filterDatesArray([startMeuRH, startEPM, startManual]));
    let end = _getLatest(filterDatesArray([endMeuRH, endEPM, endManual]));

    result.start = _dateToDateStringNoYear(start);
    result.end = _dateToDateStringNoYear(end);

    return result;
}

function _getPeriodoString(){
    let periodo = _getPeriodo();
    return periodo.start + " - " + periodo.end;
}

function _loadPonto(){
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    let keysMeuRH = [];
    let keysEPM = [];
    let keysManual = [];

    if (meuRH){
        keysMeuRH = Object.keys(meuRH['system']);
    }

    if (epm){
        keysEPM = Object.keys(epm['system']);
    }

    if (manual){
        keysManual = Object.keys(manual['system']);
    }

    let keys = keysMeuRH.concat(keysEPM, keysManual);
    keys.sort((a, b) => {
        const dateA = new Date(a.split('/').reverse().join('/'));
        const dateB = new Date(b.split('/').reverse().join('/'));
        return dateA - dateB;
    });

    for (let i = 0; i < keys.length; i++){
        _loadPontoItem(i, keys[i]);
    }
}

function _loadPontoItem(i, key){
    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    if ((meuRH && meuRH['system'][key]) || (epm && epm['system'][key]) || (manual && manual['system'][key])){
        let ponto = {
            i: i,
            date: _dateStringToDateStringNoYear(key),
            hours: {
                badge: "",
                value: ""
            },
            interval: {
                class: "",
                value: ""
            },
            punchesTableHTML: "",
            meuRH: {
                class: BADGES.warning.roundedPill,
                value: "?"
            },
            epm: {
                class: BADGES.warning.roundedPill,
                value: "?"
            },
            messagesHTML: ""
        };

        let messages = [];
    
    
        if (meuRH && meuRH['system'][key] && meuRH['system'][key].length > 0){
            const punches = _calculatePunches(meuRH['system'][key], messages);
            
            ponto.punchesTableHTML = _getPunchesTableHTML(meuRH['system'][key], messages);
            
            ponto.hours.value = punches.hours.value;
            ponto.hours.badge = punches.hours.badge;

            ponto.interval.value = punches.interval.value;
            ponto.interval.class = punches.interval.class; 

            ponto.meuRH.value = _timeToEPM(punches.hours.value);
        }

        if (epm && epm['system'][key]){
            ponto.epm.value = epm['system'][key];
        }
    }
}

function _getAccordionItemHTML(ponto){
    return `
    <div class="accordion-item">
    <h2 class="accordion-header" id="heading${ponto.i}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse${ponto.i}" aria-expanded="false" aria-controls="collapse${ponto.i}">
        ${ponto.date} <span class="badge bg-${ponto.badge} time-badge"><i class="bi bi-check-circle me-1"></i>
          ${ponto.hours}</span>
      </button>
    </h2>
    <div id="collapse${ponto.i}" class="accordion-collapse collapse" aria-labelledby="heading${ponto.i}"
      data-bs-parent="#ponto-accordion">
      <div class="accordion-body">

        <div class="item-comparison-container">
          <div class="item-comparison-table">
            <div class="item-internal-container">
              <div class="item-comparison-title">Trabalho</div>
              <div><span class="${ponto.hours.class}">${ponto.hours.value}</span></div>
            </div>
            <div class="item-internal-container">
              <div class="item-comparison-title">Intervalo</div>
              <div><span class="${ponto.interval.class}">${ponto.interval.value}</span></div>
            </div>
          </div>
        </div>

        <div class="item-comparison-container">
        ${ponto.punchesTableHTML}
        </div>

        <div class="item-comparison-container">
          <div class="item-comparison-table">
            <div class="item-internal-container">
              <div class="item-comparison-title">Meu RH</div>
              <div><span class="${ponto.meuRH.class}">${ponto.meuRH.value}</span></div>
            </div>
            <div class="item-internal-container">
              <div class="item-comparison-title">EPM</div>
              <div><span class="${ponto.epm.class}">${ponto.epm.value}</span></div>
            </div>
          </div>
        </div>

        <div class="item-internal-messages" id="message${ponto.i}">
            ${ponto.messagesHTML}
        </div>

      </div>
    </div>
  </div>`
}

function _getPunchesTableHTML(punchesArray, messages){
    if (punchesArray.length % 2 != 0){
        punchesArray.push('?')
    }
    let entradas = [];
    let saidas = [];
    let batidas;

    for (let i = 0; i < punchesArray.length; i++){
        let value = `<span class="#">${punchesArray[i]}</span>`

        if (punchesArray[i] == "?"){
            value = value.replace('#', BADGES.warning.roundedPill);
        } else {
            value = value.replace('#', "common");
        }

        if (i % 2 == 0){
            entradas.push(value);
        } else {
            saidas.push(value);
        }
    }

    if (punchesArray.length % 2 == 0){
        batidas = `<span class="common">${punchesArray.length}</span>`
    } else {
        messages.push(MESSAGES.odd);
        batidas = `<span class="${BADGES.warning.roundedPill}">${punchesArray.length}</span>`
    }

    return `
    <div class="item-comparison-table">
    <div class="item-internal-container">
      <div class="item-comparison-title">Entrada</div>
      ${entradas.join('')}
    </div>
    <div class="item-internal-container">
      <div class="item-comparison-title">Saída</div>
      ${saidas.join('')}
    </div>
  </div>
  <div class="item-internal-footer">
    <span class="item-comparison-title">Batidas: </span>${batidas}
  </div>
    `
}

function _calculatePunches(array, messages){
    let hArray = [];
    let iArray = [];
    let result = {
        hours: {
            badge: BADGES.warning.roundedPill,
            value: "0:00"
        },
        interval: {
            badge: BADGES.warning.roundedPill,
            value: "0:00"
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
        result.interval = _sumTime(iArray);
    }

    result.hours.badge = _getHoursBadge(result.hours.value, messages);
    result.interval.badge = _getIntervalBadge(result.hours.value, iArray, messages);

    return result;
}

function _getHoursBadge(hours, messages){
    const regime = _getRegime();

    if (regime == "CLT" && _isTimeStringBiggerThen(hours,"10:00")){
        messages.push(MESSAGES.tooLongJourney);
        return BADGES.warning.roundedPill;
    } else if (regime == "Estagiário" && hours != "06:00"){
        messages.push(MESSAGES.internJourneyMismatch);
        return BADGES.warning.roundedPill;
    } else {
        return "common";
    }
}

function _getIntervalBadge(hours, iArray, messages){
    result = "common";

    if (_isTimeStringBiggerThen(hours, "06:00")){
        switch(iArray.length){
            case 0:
                result = BADGES.warning.roundedPill;
                messages.push(MESSAGES.noInterval);
                break;
            case 1:
                if (_isTimeStringBiggerThen(iArray[0], "01:00") && !_isTimeStringBiggerThen(iArray[0], "02:00")){
                    result = BADGES.warning.roundedPill;
                    messages.push(MESSAGES.shortInterval);
                }
                break;
            default:
                for (let i = 0; i < iArray.length; i++){
                    if (_isTimeStringBiggerThen(iArray[i], "01:00") && !_isTimeStringBiggerThen(iArray[i], "02:00")){
                        result = BADGES.warning.roundedPill;
                        messages.push(MESSAGES.shortIntervals);
                        break;
                    }
                }
        }
    }
    return result;
}

function filterDatesArray(array){
    var filteredArray = array.filter(function(value) {
        return value !== undefined;
      });
    return filteredArray;
}