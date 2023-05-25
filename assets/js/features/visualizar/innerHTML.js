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

        <div class="item-comparison-container" id="comparison-container${ponto.i}" ${ponto.punchesTable.visibility}>
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
        ${ponto.punchesTable.innerHTML}
        </div>

        <div class="item-comparison-container" ${ponto.comparisonTable.visibility}>
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

function _loadMessagesHTML(ponto) {
  let result = [];
  let types = [];
  for (let message of messages) {
    let messageDiv;
    switch (message) {
      case MESSAGES_JSON.manual:
        messageDiv = MESSAGE_DIVS_JSON.manual;
        types.push(BADGES_JSON.manual.badge);
        break;
      case MESSAGES_JSON.epmMissing:
        messageDiv = MESSAGE_DIVS_JSON.info;
        break;
      case MESSAGES_JSON.meuRHMissing:
        messageDiv = MESSAGE_DIVS_JSON.info;
        types.push(BADGES_JSON.info.badge);
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
  ponto.messagesHTML = result.join("");
  let typesS = types.toString();

  if (typesS.includes(BADGES_JSON.danger.badge)) {
    ponto.title.badge = BADGES_JSON.danger.badge;
    ponto.title.icon = BADGES_JSON.danger.icon;
  } else if (typesS.includes(BADGES_JSON.warning.badge)) {
    ponto.title.badge = BADGES_JSON.warning.badge;
    ponto.title.icon = BADGES_JSON.warning.icon;
    ponto.title.textType = "text-dark";
  } else if (typesS.includes(BADGES_JSON.info.badge)) {
    ponto.title.badge = BADGES_JSON.info.badge;
    ponto.title.icon = BADGES_JSON.info.icon;
  }
}

function _getPunchesTableHTML(punchesArray, messages, i) {
  if (punchesArray.length % 2 != 0) {
    punchesArray.push('?')
  }
  let entradas = [];
  let saidas = [];
  let intervalos = ["-"];
  let batidas;

  for (let j = 0; j < punchesArray.length; j++) {
    let value = `<span class="#1" id="#2">${punchesArray[j]}</span>`

    if (punchesArray[j] == "?") {
      value = value.replace('#1', BADGES_JSON.warning.roundedPill);
    } else {
      value = value.replace('#1', BADGES_JSON.common.badge);
    }

    if (j % 2 == 0) {
      value = value.replace('#2', `e-${i}-${j}`);
      entradas.push(value);
      if (j > 0) {
        let intervaloValue = `<span class="${BADGES_JSON.common.badge}" id="i-${i}-${j}">${_timeDifference(punchesArray[j - 1], punchesArray[j])}</span>`;
        intervalos.push(intervaloValue);
      }
    } else {
      value = value.replace('#2', `s-${i}-${j}`);
      saidas.push(value);
    }
  }

  // Batidas
  if (punchesArray.length % 2 == 0) {
    batidas = `<span class="common">${punchesArray.length}</span>`
  } else {
    messages.push(MESSAGES_JSON.odd);
    batidas = `<span class="${BADGES_JSON.warning.roundedPill}">${punchesArray.length}</span>`
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