// ==== Loaders ====
function _loadPonto(checkBoxes, type, system) {
    let keys = Object.keys(system);
    let i = 0;

    for (let key of keys) {
        let ponto = _getInitialPontoItem(i, key);
        let messages = [];

        // Date
        _loadPontoDate(ponto);

        // Meu RH
        _loadPontoMeuRH(ponto, messages, type);
        _validatePontoValue(ponto, "meuRH", messages);

        // EPM
        if (type == "epm") {
            _loadPontoEPM(ponto, messages);
            _validatePontoValue(ponto, "epm", messages);
            ponto.meuRH.visibility = "style='display: none;'"
        } else {
            ponto.epm.visibility = "style='display: none;'"
        }

        ponto.htmlElements.sumUpContainerHTML = _getSumUpContainerHTML(ponto, type);

        // Simulate
        _loadVisualizarSimMessage(ponto, messages);

        // Meu RH and EPM Comparison
        if ((type == "meuRH" && checkBoxes.checkboxEPM == true) || (type == "epm" && checkBoxes.checkboxMeuRH == true)) {
            if (ponto.simulate == false) {
                _loadComparison(ponto, messages);
            }
        } else {
            ponto.htmlElements.comparisonTable.visibility = "style='display: none;'"
        }

        // Messages HTML
        _loadMessagesHTML(ponto, messages);

        // Apply to HTML
        if (!(checkBoxes.checkboxVazio == true && (ponto.title.value == "00:00" || ponto.title.value == "0,0"))) {
            _loadAccordionItemHTML(ponto)
            _setVisibilityAfterLoad(i);
        }
        i++;
    }
}

function _getInitialPontoItem(i, key) {
    let ponto = JSON.parse(JSON.stringify(PONTO))
    ponto.i = i;
    ponto.key = key;

    ponto.title.roundedPill = BADGES_JSON.success.roundedPill;
    ponto.title.badge = BADGES_JSON.success.badge;
    ponto.title.icon = BADGES_JSON.success.icon;

    ponto.htmlElements.hours.roundedPill = BADGES_JSON.info.roundedPill;
    ponto.htmlElements.hours.badge = BADGES_JSON.info.badge;
    ponto.htmlElements.hours.icon = BADGES_JSON.info.icon;

    ponto.htmlElements.interval.internalRoundedPill = BADGES_JSON.common.roundedPill;

    ponto.meuRH.roundedPill = BADGES_JSON.info.roundedPill;
    ponto.epm.roundedPill = BADGES_JSON.info.roundedPill

    return ponto;
}

function _loadPontoMeuRH(ponto, messages, type) {
    const meuRH = _getLocal('meuRH');
    if (meuRH && meuRH['system'] && meuRH['system'][ponto.key]) {
        ponto.htmlElements.observation.value = meuRH['system'][ponto.key]["observation"];
        ponto.htmlElements.observation.innerHTML = _getPontoObservationInnerHTML(ponto.htmlElements.observation.value, ponto.i);

        const PUNCHES = _getPunches(meuRH['system'][ponto.key]["punches"], messages);

        if (type == "meuRH") {
            ponto.htmlElements.interval.internalRoundedPill = PUNCHES.interval.internalRoundedPill
            ponto.htmlElements.punchesTable.innerHTML = _getPunchesTableHTML(ponto, meuRH['system'][ponto.key]["punches"], messages);

            ponto.htmlElements.hours.value = PUNCHES.hours.value;
            ponto.htmlElements.hours.roundedPill = PUNCHES.hours.roundedPill;
            ponto.htmlElements.hours.badge = PUNCHES.hours.badge;
            ponto.htmlElements.hours.icon = PUNCHES.hours.icon;

            ponto.htmlElements.interval.value = PUNCHES.interval.value;
            ponto.htmlElements.interval.roundedPill = PUNCHES.interval.roundedPill;
            ponto.htmlElements.interval.icon = PUNCHES.interval.icon;

            ponto.title.value = PUNCHES.hours.value;
        };
        ponto.meuRH.value = _timeToEPM(PUNCHES.hours.value);
    }
}

function _loadPontoEPM(ponto, messages) {
    const epm = _getLocal('epm');

    ponto.epm.value = epm['system'][ponto.key];
    ponto.epm.valueTime = _epmToTime(ponto.epm.value);

    if (_isTimeStringBiggerThen(ponto.epm.valueTime, "10:00")) {
        messages.push(MESSAGES_JSON.tooLongJourney);
        ponto.epm.roundedPill = BADGES_JSON.warning.roundedPill;
    } else {
        ponto.epm.roundedPill = BADGES_JSON.common.roundedPill;
    }

    ponto.htmlElements.punchesTable.visibility = `style="display:none;"`;

    ponto.title.value = ponto.epm.value;
}

function _loadRulesEPM(ponto, messages) {
    const regime = _getRegime();
    if (regime)

        if (_isTimeStringBiggerThen(ponto.epm.valueTime, "10:00")) {
            messages.push(MESSAGES_JSON.tooLongJourney);
            ponto.epm.roundedPill = BADGES_JSON.warning.roundedPill;
        } else {
            ponto.epm.roundedPill = BADGES_JSON.common.roundedPill;
        }

}

function _loadPontoDate(ponto) {
    const dateNoYear = _dateStringToDateStringNoYear(ponto.key);
    const dayOfTheWeek = _getDayOfTheWeek(ponto.key);
    ponto.htmlElements.date = `<div class="dateBox" id=date${ponto.i}>${dateNoYear}</div><div class="dayOfTheWeek"> ${dayOfTheWeek}</div>`
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
            internalRoundedPill: BADGES_JSON.common.roundedPill,
            value: "00:00"
        },
    }

    if (array.length > 1) {
        _loadHoursAndInterval(result, array, hArray, iArray);

        result.hours.badge = _getHoursBadge(result.hours.value, messages);
        result.hours.roundedPill = _getHoursRoundedPill(result.hours.badge);
        result.hours.icon = _getIcon(result.hours.badge);

        _loadIntervalRules(result, iArray, messages);

        result.interval.icon = _getIcon(result.interval.badge);
    }
    return result;
}

function _getHoursBadge(hours, messages) {
    const regime = _getRegime();
    if (regime == "CLT" && _isTimeStringBiggerThen(hours, "10:00")) {
        messages.push(MESSAGES_JSON.tooLongJourney);
        return BADGES_JSON.warning.badge;
    } else if (regime == "Estágio (6h)" && hours != "06:00") {
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

function _loadIntervalRules(result, iArray, messages) {
    let hours = result.hours.value;

    if (_isTimeStringBiggerThen(hours, "06:00")) {
        switch (iArray.length) {
            case 0:
                result.interval.roundedPill = BADGES_JSON.warning.roundedPill;
                messages.push(MESSAGES_JSON.noInterval);
                break;
            case 1:
                if (iArray[0] != "01:00" && (!_isTimeStringBiggerThen(iArray[0], "01:00") || _isTimeStringBiggerThen(iArray[0], "02:00"))) {
                    result.interval.roundedPill = BADGES_JSON.warning.roundedPill;
                    messages.push(MESSAGES_JSON.noMainInterval);
                }
                break;
            default:
                let mainInterval = false;
                for (let interval of iArray) {
                    if (interval == "01:00" || (_isTimeStringBiggerThen(interval, "01:00") && !_isTimeStringBiggerThen(interval, "02:00"))) {
                        mainInterval = true;
                        break;
                    }
                }
                if (!mainInterval) {
                    result.interval.internalRoundedPill = BADGES_JSON.warning.roundedPill;
                    messages.push(MESSAGES_JSON.noMainIntervals);
                }
        }
    }
}

// ==== Validators ====
function _validatePontoValue(ponto, value, messages) {
    if (value == "meuRH" || value == "epm") {
        if (ponto[value].value == "?") {
            messages.push(MESSAGES_JSON[`${value}Missing`]);
        } else if (ponto[value].roundedPill != BADGES_JSON.warning.roundedPill) {
            ponto[value].roundedPill = BADGES_JSON.common.roundedPill;
        }
    }
}

function _loadComparison(ponto, messages) {
    const meuRH = _getLocal("meuRH");
    const epm = _getLocal("epm");

    if (!ponto.epm.value) {
        ponto.epm.value = epm['system'][ponto.key] || "?";
        ponto.epm.roundedPill = BADGES_JSON.common.roundedPill;
        if (ponto.epm.value == "?") {
            ponto.epm.roundedPill = BADGES_JSON.info.roundedPill;
            messages.push(MESSAGES_JSON.epmMissing);
        }
    }

    if (!ponto.meuRH.value){
        let result = "?";
        const system = meuRH['system'][ponto.key];
        if (system) {
            const punches = system.punches;
            if (punches.length > 1){
                _loadHoursAndInterval(ponto, punches);
                result = _timeToEPM(ponto.hours.value);
            } else result = "0,0"
        }
        ponto.meuRH.value = result;
    }

    if (ponto.meuRH.value == "?") {
        ponto.meuRH.roundedPill = BADGES_JSON.info.roundedPill;
        messages.push(MESSAGES_JSON.meuRHMissing);
    }

    if (ponto.meuRH.value != "?" && ponto.epm.value != "?" && ponto.meuRH.value != ponto.epm.value) {
        _loadNoMatchMessage(ponto, messages);
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

    const observation = document.getElementById(`observation${i}`);
    const sumUpContainer = document.getElementById(`sumUp-container${i}`);

    if (observation && sumUpContainer) {
        sumUpContainer.style.marginTop = "35px"
    }
}

function _loadNoMatchMessage(ponto, messages) {
    const valueMeuRH = ponto.meuRH.value;
    const valueEPM = ponto.epm.value;
    const oddPunches = ponto.meuRH.missingPunches;

    if (valueMeuRH === "?" || valueEPM === "?") {
        ponto.meuRH.roundedPill = BADGES_JSON.warning.roundedPill;
        ponto.epm.roundedPill = BADGES_JSON.warning.roundedPill;
        let location = valueMeuRH === "?" ? "<b>Meu RH</b>" : "<b>EPM</b>";
        messages.push(`${MESSAGES_JSON.noMatch} Preencha as horas no ${location}.`);
    } else {
        const valMeuRH = _epmToNumber(valueMeuRH);
        const valEPM = _epmToNumber(valueEPM);
        const difference = valMeuRH - valEPM;
        if (difference !== 0) {
            ponto.meuRH.roundedPill = BADGES_JSON.warning.roundedPill;
            ponto.epm.roundedPill = BADGES_JSON.warning.roundedPill;
            const simuleAqui = `Clique em <a class="warningLink" href="epm-conversores.html?total=${encodeURIComponent(valueMeuRH)}&usadas=${encodeURIComponent(valEPM)}">Converter</a> para facilitar no cálculo de horas.`
            switch (true) {
                case oddPunches:
                    messages.push(` Adicione o ponto ausente no <b>Meu RH</b> para depois comparar com o <b>EPM</b>.`);
                    break;
                case (valEPM === 0):
                    messages.push(`${MESSAGES_JSON.noEPM} Adicione <b>${_numberToEpm(difference)}h</b>. ${simuleAqui}.`);
                    break;
                case (difference > 0):
                    messages.push(`${MESSAGES_JSON.noMatch} Adicione <b>${_numberToEpm(difference)}h</b> ao <b>EPM</b>. ${simuleAqui}.`);
                    break;
                case (difference < 0):
                    messages.push(`${MESSAGES_JSON.noMatch} Remova <b>${_numberToEpm(difference * -1)}h</b> do <b>EPM</b>. ${simuleAqui}.`);
                    break;
            }
        }
    }
}

function _loadVisualizarSimMessage(ponto, messages) {
    const oddPunches = ponto.meuRH.missingPunches;
    const today = _dateToDateString(new Date());
    if (today == ponto.key && oddPunches) {
        const div = ponto.htmlElements.punchesTable;
        let batidasHTML = div.innerHTML;
        if (batidasHTML) {
            const roundedPill = BADGES_JSON.simulate.roundedPill;

            _replaceRoundedPill(div, roundedPill, 'batidas');
            _replaceRoundedPill(div, roundedPill, 'pontoNotFound');

            ponto.meuRH.roundedPill = roundedPill;
            ponto.epm.roundedPill = roundedPill;
            messages.push(MESSAGES_JSON.simulate);
            ponto.simulate = true;
        }
    }
}

function _replaceRoundedPill(div, roundedPill, classComplement) {
    let innerHTML = div.innerHTML;
    innerHTML = innerHTML.replace(`${BADGES_JSON.warning.roundedPill} ${classComplement}`, roundedPill);
    innerHTML = innerHTML.replace(`${BADGES_JSON.common.roundedPill} ${classComplement}`, roundedPill);
    div.innerHTML = innerHTML;
}

function _loadHoursAndInterval(result, array, hArray = [], iArray = []){
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
}