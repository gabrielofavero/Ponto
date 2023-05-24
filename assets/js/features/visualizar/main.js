const MESSAGE_DIVS_JSON = {
    manual: `<div class="alert alert-primary item-mensagem" role="alert"><i class="bi bi-pencil me-1"></i> #1</div>`,
    info: `<div class="alert alert-secondary item-mensagem" role="alert"><i class="bi bi-info-circle me-1"></i> #1</div>`,
    warning: `<div class="alert alert-warning item-mensagem" role="alert"><i class="bi bi-exclamation-triangle me-1"></i> #1</div>`
}

const MESSAGES_JSON = {
    manual: "Alguns dados foram editados manualmente. Atualize também no <b>MeuRH / EPM</b>",
    meuRHMissing: "Não é possível comparar com o <b>Meu RH</b> pois não existem dados para essa data.",
    epmMissing: "Não é possível comparar com o <b>EPM</b> pois não existem dados para essa data.",
    noMatch: "Os horários do <b>Meu RH</b> e <b>EPM</b> não batem.",
    noInterval: "Você trabalhou mais de 6 horas, mas não teve um intervalo que durou entre <b>1 a 2 horas</b>.",
    noMainInterval: "Apesar de você ter feito um intervalo, ele não durou entre <b>1 a 2 horas</b>.",
    noMainIntervals: "Apesar de ter feito mais de um intervalo, nenhum deles durou entre <b>1 a 2 horas</b>.",
    odd: "Você marcou um número ímpar de batidas. Realize o ajuste manual para incluir o horário ausente.",
    tooLongJourney: "Você trabalhou mais de 10 horas. Só é autorizado trabalhar até 2h extras por dia.",
    internJourneyMismatch: "Você não trabalhou 6 horas. Estagiários devem trabalhar exatamente 6 horas por dia.",
}

const BUTTONS_JSON = {
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

const BADGES_JSON = {
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
        roundedPill: "common",
        icon: ""
    }
}

const PONTO_ITEM_JSON = {
    key: "",
    i: 0,
    date: "",
    title: {
        roundedPill: "",
        badge: "",
        value: "00:00",
        icon: "",
        textType: ""
    },
    hours: {
        roundedPill: "",
        badge: "",
        value: "",
        icon: ""
    },
    interval: {
        roundedPill: "",
        value: ""
    },
    punchesTable:{
        visibility: "",
        innerHTML: ""
    },
    meuRH: {
        roundedPill: "",
        value: "?"
    },
    epm: {
        roundedPill: "",
        value: "?"
    },
    messagesHTML: ""
};
// ==== Main ====
function _startVisualizar() {
    //_loadJsons();
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

function _loadJson(jsonFile, targetVariable) {
    if (!targetVariable) {
        return new Promise(function(resolve, reject) {
            $.getJSON(`assets/json/${jsonFile}`)
                .then(function(data) {
                    targetVariable = data;
                    resolve();
                })
                .catch(function(error) {
                    console.error(`Error loading JSON file: ${jsonFile}`);
                    reject(error);
                });
        });
    } else {
        return Promise.resolve(); // JSON already loaded, resolve immediately
    }
}

// ==== Loaders ====
function _loadJsons() {
    if (!BADGES_JSON) {
        $.getJSON("../json/Badges.json")
            .then(function (data) {
                BADGES_JSON = data;
            })
    }

    if (!BUTTONS_JSON) {
        $.getJSON("assets/json/Buttons.json")
            .then(function (data) {
                BUTTONS_JSON = data;
            })
    }

    if (!MESSAGES_DIVS_JSON) {
        $.getJSON("assets/json/Message Divs.json")
            .then(function (data) {
                MESSAGES_DIVS_JSON = data;
            })
    }

    if (!MESSAGES_JSON) {
        $.getJSON("assets/json/Messages.json")
            .then(function (data) {
                MESSAGES_JSON = data;
            })
    }

    if (!PONTO_ITEM_JSON) {
        $.getJSON("assets/json/Ponto Item.json")
            .then(function (data) {
                PONTO_ITEM_JSON = data;
            })
    }
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