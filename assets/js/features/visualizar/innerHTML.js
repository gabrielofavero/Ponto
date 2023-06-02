// === Loaders ===
function _loadAccordionItemHTML(ponto) {
  let result = `
    <div class="accordion-item">
    <h2 class="accordion-header" id="heading${ponto.i}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse${ponto.i}" aria-expanded="false" aria-controls="collapse${ponto.i}">
        ${ponto.htmlElements.date} <span class="badge bg-${ponto.title.badge} time-badge ${ponto.title.textType}" id="badge${ponto.i}"><i class="${ponto.title.icon} me-1"></i>
          ${ponto.title.value}</span>
      </button>
    </h2>
    <div id="collapse${ponto.i}" class="accordion-collapse collapse" aria-labelledby="heading${ponto.i}"
      data-bs-parent="#ponto-accordion">
      <div class="accordion-body">

        ${ponto.htmlElements.observation.innerHTML}
        ${ponto.htmlElements.sumUpContainerHTML}

        <div class="item-comparison-container" id="punchesTable${ponto.i}">
        ${ponto.htmlElements.punchesTable.innerHTML}
        </div>

        <div class="item-comparison-container" ${ponto.htmlElements.comparisonTable.visibility}>
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
            ${ponto.htmlElements.messagesHTML}
        </div>

      </div>
    </div>
  </div>`

  document.getElementById("accordion-items").innerHTML += result;
}

function _loadMessagesHTML(ponto, messages) {
  let result = [];
  let types = [];

  if (messages.length > 0) {
    if (messages.includes(MESSAGES_JSON.simulate)) {
      let messageDiv = MESSAGE_DIVS_JSON.simulate;
      types.push(BADGES_JSON.simulate.badge);
      result.push(messageDiv.replace("#1", _getSimulateMessageWithURL(ponto.key)));
    } else {
      for (let message of messages) {
        let messageDiv;
        switch (message) {
          case MESSAGES_JSON.epmMissing:
          case MESSAGES_JSON.meuRHMissing:
            messageDiv = MESSAGE_DIVS_JSON.info;
            types.push(BADGES_JSON.info.badge);
            break;
          case MESSAGES_JSON.observation:
            messageDiv = MESSAGE_DIVS_JSON.info;
            types.push(BADGES_JSON.info.badge);
            message = message.replace("#1", ponto.htmlElements.observation.value);
            break;
          case "":
          case undefined:
          case null:
            break;
          default:
            messageDiv = MESSAGE_DIVS_JSON.warning;
            types.push(BADGES_JSON.warning.badge);
        }
        if (messageDiv) {
          result.push(messageDiv.replace("#1", message));
        }
      }
    }
  } else {
    result.push(MESSAGE_DIVS_JSON.success.replace("#1", MESSAGES_JSON.valid));
  }

  ponto.htmlElements.messagesHTML = result.join("");
  let typesS = types.toString();
  const priorityOrder = ["simulate", "warning", "info", "success"];

  for (const badgeType of priorityOrder) {
    if (typesS.includes(BADGES_JSON[badgeType].badge)) {
      ponto.title.badge = BADGES_JSON[badgeType].badge;
      ponto.title.icon = BADGES_JSON[badgeType].icon;
      const textType = BADGES_JSON[badgeType].textType;
      if (textType) {
        ponto.title.textType = textType;
      }
      break;
    }
  }
}

// === Getters ===
function _getPunchesTableHTML(ponto, punchesArray, messages) {
  const i = ponto.i;
  const internalIntervalBadge = ponto.htmlElements.interval.internalRoundedPill;
  let startInvalid = false;
  let endInvalid = false;

  if (punchesArray.length % 2 != 0) {
    punchesArray.push('?');
    ponto.meuRH.missingPunches = true;
  }
  let entradas = [];
  let saidas = [];
  let intervalos = [];
  let batidas;

  if (punchesArray.length > 0) {
    if (_isTimeStringSmallerThen(punchesArray[0], "05:00")) {
      messages.push(MESSAGES_JSON.tooEarly);
      startInvalid = true;
    }

    if (_isTimeStringBiggerThen(punchesArray[punchesArray.length - 1], "22:00")) {
      messages.push(MESSAGES_JSON.tooLate);
      endInvalid = true;
    }

    for (let j = 0; j < punchesArray.length; j++) {
      let value = `<span class="#1" id="#2">${punchesArray[j]}</span>`

      if (punchesArray[j] == "?" || (j == 0 && startInvalid) || (j == punchesArray.length - 1 && endInvalid)) {
        value = value.replace('#1', `${BADGES_JSON.warning.roundedPill} pontoNotFound`);
      } else {
        value = value.replace('#1', BADGES_JSON.common.badge);
      }

      if (j % 2 == 0) {
        value = value.replace('#2', `e-${i}-${j}`);
        entradas.push(value);
        if (j > 0) {
          let intervaloValue = `<span class="${internalIntervalBadge}" id="i-${i}-${j}">${_timeDifference(punchesArray[j - 1], punchesArray[j])}</span>`;
          intervalos.push(intervaloValue);
        }
      } else {
        value = value.replace('#2', `s-${i}-${j}`);
        saidas.push(value);
      }
    }
  }

  intervalos.push("-");

  // Batidas
  if (ponto.meuRH.missingPunches == true) {
    messages.push(MESSAGES_JSON.odd);
    ponto.meuRH.punches = punchesArray.length - 1;
    batidas = `<span class="${BADGES_JSON.warning.roundedPill} batidas">${punchesArray.length - 1}</span>`
  } else {
    ponto.meuRH.punches = punchesArray.length;
    batidas = `<span class="${BADGES_JSON.common.roundedPill} batidas" batidas>${punchesArray.length}</span>`
  }

  return `
    <div class="item-comparison-table" id="item-comparison-table${i}"">
      <div class="item-internal-container">
        <div class="item-comparison-title">Entrada</div>
        <div id="entradas${i}">
            ${entradas.join('<br>')}
        </div>
      </div>
      <div class="item-internal-container">
        <div class="item-comparison-title">Saída</div>
        <div id="saidas${i}">
            ${saidas.join('<br>')}
        </div>
      </div>
      <div class="item-internal-container">
      <div class="item-comparison-title">Intervalo</div>
      <div id="intervalo${i}">
          ${intervalos.join('<br>')}
      </div>
    </div>
    </div>
  <div class="item-internal-footer">
    <span class="item-comparison-title">Batidas: </span>${batidas}
  </div>
    `
}

function _getPontoObservationInnerHTML(value, i) {
  return `<div class="badge bg-light observation" id="observation${i}"></i>${value}</div>`;
}

function _getSumUpContainerHTML(ponto, type) {
  let result = "";

  let visibility;
  let title1;
  let badge1;
  let value1;
  let title2;
  let badge2;
  let value2

  if (type == "meuRH") {
    visibility = ponto.htmlElements.punchesTable.visibility;

    title1 = "Trabalho";
    badge1 = ponto.htmlElements.hours.roundedPill;
    value1 = ponto.htmlElements.hours.value;

    title2 = "Intervalo";
    badge2 = ponto.htmlElements.interval.roundedPill;
    value2 = ponto.htmlElements.interval.value;
  } else if (type == "epm") {
    visibility = ponto.epm.visibility;

    title1 = "EPM";
    badge1 = BADGES_JSON.common.roundedPill;
    value1 = ponto.epm.value;

    title2 = "Hora Aprox.";
    badge2 = ponto.epm.roundedPill;
    value2 = ponto.epm.valueTime;
  }


  if (type == "meuRH" || type == "epm") {
    result = `
    <div class="item-comparison-container" id="sumUp-container${ponto.i}" ${visibility}>
      <div class="item-comparison-table">
        <div class="item-internal-container">
          <div class="item-comparison-title">${title1}</div>
          <div><span class="${badge1}">${value1}</span></div>
        </div>
        <div class="item-internal-container">
          <div class="item-comparison-title">${title2}</div>
          <div><span class="${badge2}">${value2}</span></div>
        </div>
      </div>
    </div>`;
  }

  return result;
}

function _getSimulateMessageWithURL(key) {
  const date = encodeURIComponent(key);
  const punches = encodeURIComponent(_getLocal("meuRH")["system"][key]["punches"].toString())
  const url = `meuRH-simular.html?date=${date}&punches=${punches}`

  return MESSAGES_JSON.simulate.replace('meuRH-simular.html', url);
}