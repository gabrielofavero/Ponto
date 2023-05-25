// ==== Dynamic Variables ====
var messages = [];


// ==== Loaders ====
function _loadPontoItem(i, key, checkBoxes={}) {
    const meuRH = _getLocal('meuRH');
    const epm = _getLocal('epm');
    const manual = _getLocal('manual');

    if ((meuRH && meuRH['system'][key]) || (epm && epm['system'][key]) || (manual && manual['system'][key])) {
        let ponto = _getInitialPontoItem(i, key);
        messages = [];

        // Date
        _loadPontoDate(ponto);

        // Meu RH
        _loadPontoItemMeuRH(ponto);
        _validatePontoValue(ponto, "meuRH");

        // EPM
        if (checkBoxes.checkboxEPM == true) {
            _loadPontoItemEPM(ponto);
            _validatePontoValue(ponto, "epm");
        } else {
            ponto.comparisonTable.visibility = "style='display: none;'"
            ponto.epm.visibility = "style='display: none;'"
        }

        // Meu RH and EPM Comparison
        _validateMeuRHAndEPM(ponto);

        // Messages HTML
        _loadMessagesHTML(ponto);

        // Apply to HTML
        if (!(checkBoxes.checkboxVazio == true && ponto.title.value == "00:00")) {
        _loadAccordionItemHTML(ponto)
        _setVisibilityAfterLoad(i);
        }
    }
}

function _getInitialPontoItem (i, key){
    let ponto = JSON.parse(JSON.stringify(PONTO_ITEM_JSON))
    ponto.i = i;
    ponto.key = key;
    
    ponto.title.roundedPill = BADGES_JSON.success.roundedPill;
    ponto.title.badge = BADGES_JSON.success.badge;
    ponto.title.icon = BADGES_JSON.success.icon;

    ponto.hours.roundedPill = BADGES_JSON.info.roundedPill;
    ponto.hours.badge = BADGES_JSON.info.badge;
    ponto.hours.icon = BADGES_JSON.info.icon;

    ponto.meuRH.roundedPill = BADGES_JSON.info.roundedPill;
    ponto.epm.roundedPill = BADGES_JSON.info.roundedPill

    return ponto;
}

function _loadPontoItemMeuRH(ponto) {
    const meuRH = _getLocal('meuRH');
    if (meuRH && meuRH['system'][ponto.key]) {
        const PUNCHES = _getPunches(meuRH['system'][ponto.key], messages);

        ponto.punchesTable.innerHTML = _getPunchesTableHTML(meuRH['system'][ponto.key], messages, ponto.i);

        ponto.hours.value = PUNCHES.hours.value;
        ponto.hours.roundedPill = PUNCHES.hours.roundedPill;
        ponto.hours.badge = PUNCHES.hours.badge;
        ponto.hours.icon = PUNCHES.hours.icon;

        ponto.interval.value = PUNCHES.interval.value;
        ponto.interval.roundedPill = PUNCHES.interval.roundedPill;
        ponto.interval.icon = PUNCHES.interval.icon;

        ponto.title.value = PUNCHES.hours.value;
        ponto.meuRH.value = _timeToEPM(PUNCHES.hours.value);
    }
}

function _loadPontoItemEPM(ponto) {
    const meuRH = _getLocal('meuRH');
    const epm = _getLocal('epm');
    const manual = _getLocal('manual');
    if (epm && epm['system'][ponto.key]) {
        if ((!meuRH || !meuRH['system'][ponto.key]) && (!manual || !manual['system'][ponto.key])) {
            _loadPontoItemEPMExclusive(ponto);
        } else {
            ponto.epm.value = epm['system'][ponto.key];
            ponto.epm.roundedPill = BADGES_JSON.common.roundedPill;
        }
    }
}

function _loadPontoItemEPMExclusive(ponto) {
    const epm = _getLocal('epm');

    ponto.epm.value = epm['system'][ponto.key];
    ponto.epm.roundedPill = BADGES_JSON.common.roundedPill;

    ponto.punchesTable.visibility = `style="display:none;"`

    ponto.title.value = _epmToTime(ponto.epm.value);
}

function _loadPontoDate(ponto) {
    const dateNoYear = _dateStringToDateStringNoYear(ponto.key);
    const dayOfTheWeek = _getDayOfTheWeek(ponto.key);
    ponto.date = `${dateNoYear}<div class="dayOfTheWeek"> ${dayOfTheWeek}</div>`
}

// ==== Getters ====

function _getPunches(array, messages) {
    let hArray = [];
    let iArray = [];
    let result = {
        hours: {
            badge: BADGES_JSON.common.badge,
            roundedPill: BADGES_JSON.common.roundedPill,
            icon: BADGES_JSON.common.icon,
            value: "00:00"
        },
        interval: {
            roundedPill: BADGES_JSON.common.roundedPill,
            icon: BADGES_JSON.common.icon,
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
        messages.push(MESSAGES_JSON.tooLongJourney);
        return BADGES_JSON.warning.badge;
    } else if (regime == "Estagiário" && hours != "06:00") {
        messages.push(MESSAGES_JSON.internJourneyMismatch);
        return BADGES_JSON.warning.badge;
    } else {
        return BADGES_JSON.common.badge;
    }
}

function _getHoursRoundedPill(badge) {
    switch (badge) {
        case BADGES_JSON.warning.badge:
            return BADGES_JSON.warning.roundedPill;
        case BADGES_JSON.danger.badge:
            return BADGES_JSON.danger.roundedPill;
        case BADGES_JSON.danger.badge:
            return BADGES_JSON.success.roundedPill;
        case BADGES_JSON.info.badge:
            return BADGES_JSON.info.roundedPill;
        default:
            return BADGES_JSON.common.roundedPill;
    }
}

function _getIcon(badge) {
    switch (badge) {
        case BADGES_JSON.warning.badge:
            return BADGES_JSON.warning.icon;
        case BADGES_JSON.danger.badge:
            return BADGES_JSON.danger.icon;
        case BADGES_JSON.success.badge:
            return BADGES_JSON.success.icon;
        case BADGES_JSON.info.badge:
            return BADGES_JSON.info.icon;
        default:
            return BADGES_JSON.common.icon;
    }
}

function _getIntervalRoundedPill(hours, iArray, messages) {
    result = BADGES_JSON.common.roundedPill;
    if (_isTimeStringBiggerThen(hours, "06:00")) {
        switch (iArray.length) {
            case 0:
                result = BADGES_JSON.warning.roundedPill;
                messages.push(MESSAGES_JSON.noInterval);
                break;
            case 1:
                if (iArray[0] != "01:00" && (!_isTimeStringBiggerThen(iArray[0], "01:00") || _isTimeStringBiggerThen(iArray[0], "02:00"))) {
                    result = BADGES_JSON.warning.roundedPill;
                    messages.push(MESSAGES_JSON.noMainInterval);
                }
                break;
            default:
                for (let i = 0; i < iArray.length; i++) {
                    let hasMainInterval = false;
                    if (_isTimeStringBiggerThen(iArray[i], "01:00") && !_isTimeStringBiggerThen(iArray[i], "02:00")) {
                        hasMainInterval = true;
                        break;
                    }
                    if (!hasMainInterval) {
                        result = BADGES_JSON.warning.roundedPill;
                        messages.push(MESSAGES_JSON.noMainIntervals);
                    }
                }
        }
    }
    return result;
}

// ==== Validators ====
function _validatePontoValue(ponto, value, i) {
    if (value == "meuRH" || value == "epm") {
        if (ponto[value].value == "?") {
            messages.push(MESSAGES_JSON[`${value}Missing`]);
        } else {
            ponto[value].roundedPill = BADGES_JSON.common.roundedPill;
        }
    }
}

function _validateMeuRHAndEPM(ponto) {
    if (ponto.meuRH.value != "?" && ponto.epm.value != "?" && ponto.meuRH.value != ponto.epm.value) {
        ponto.meuRH.roundedPill = BADGES_JSON.warning.roundedPill;
        ponto.epm.roundedPill = BADGES_JSON.warning.roundedPill;
        messages.push(MESSAGES_JSON.noMatch);
    }
}

// ==== Setters ====
function _setVisibilityAfterLoad(i) {
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