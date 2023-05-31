function _startSimular() {
  _loadSimularPlaceHolders();
  _loadSimularEventListeners();
}

function _loadSimularPlaceHolders() {
  const input = document.getElementById('periodoInput');
  const today = new Date().toISOString().substring(0, 10);
  input.value = today;

  const regimes = REGIMES || _getJSON('assets/json/visualizar/Regimes.json');
  const regimeValue = _getRegime();
  let optionComum = document.getElementById('optionComum');
  let optionEstagio = document.getElementById('optionEstagio');

  if (regimeValue && regimeValue == regimes.estagio) {
    optionEstagio.selected = true;
    optionComum.selected = false;
  }

  const saldoDiv = document.getElementById('saldoInput');
  const saldoValue = _getSaldo();

  if (saldoValue) {
    saldoDiv.value = saldoValue;
  }
}

function _applySimulation() {
  const periodoInput = _getVal('periodoInput');

  if (periodoInput) {
    const regime = _getVal('regimeInput');
    const saldo = _getVal('saldoInput');
    const periodo = _dateInputToDateString(_getVal('periodoInput'));
    const dayOfTheWeek = periodo ? _getDayOfTheWeek(periodo) : "";
    const punches = _getSimPunches();
  
    _applyVal('simular-date', periodo);
    _applyVal('simular-dayOfTheWeek', dayOfTheWeek);
  
    if (punches.length > 0) {
      _loadPontoSim(regime, saldo, punches);
    } else {
      _loadSimWarning("Insira no mínimo 1 ponto para simular.");
    }
  } else {
    _loadSimWarning("Insira uma data válida para simular.")
  }


}

function _loadSimularEventListeners() {
  const simular = document.getElementById('simular-button');
  simular.addEventListener('click', function () {
    _applySimulation();
  });

  _resizeRegime();
}

function _getVal(id) {
  try {
    return document.getElementById(id).value;
  } catch (e) {
    return "";
  }
}

function _applyVal(id, val) {
  document.getElementById(id).innerHTML = val;
}

function _loadPontoSim(regime, saldo, punches) {
  let messages = [];
  let ponto;
  if (PONTO) {
    ponto = JSON.parse(JSON.stringify(PONTO));
  } else {
    ponto = _getJSON('assets/json/visualizar/Ponto.json');
  }

  const SALDO = "00:00";
  const PUNCHES = _getPunches(punches, messages);

  ponto.htmlElements.interval.internalRoundedPill = PUNCHES.interval.internalRoundedPill
  ponto.htmlElements.punchesTable.innerHTML = _getPunchesTableHTML(ponto, punches, messages);

  ponto.htmlElements.hours.value = PUNCHES.hours.value;
  ponto.htmlElements.hours.roundedPill = PUNCHES.hours.roundedPill;
  ponto.htmlElements.hours.badge = PUNCHES.hours.badge;
  ponto.htmlElements.hours.icon = PUNCHES.hours.icon;

  ponto.htmlElements.interval.value = PUNCHES.interval.value;
  ponto.htmlElements.interval.roundedPill = PUNCHES.interval.roundedPill;
  ponto.htmlElements.interval.icon = PUNCHES.interval.icon;

  ponto.title.value = PUNCHES.hours.value;
  ponto.epm.value = _timeToEPM(PUNCHES.hours.value);

  _loadSimHTML(SALDO, ponto);
}

function _getSimPunches() {
  let result = [];
  for (let i = 0; i < 5; i++) {
    let e = _getVal('e' + i);
    if (e) {
      result.push(e);
    }
    let s = _getVal('s' + i);
    if (s) {
      result.push(s);
    }
  }
  if (result.length > 1) {
    result = _orderArrayByTime(result);
  }
  return result;
}

function _loadSimWarning(text) {
  _applyVal('simular-body', `<div class="alert alert-warning alert-dismissible fade show" role="alert">${text}</div>`)
}

function _loadSimHTML(saldo, ponto) {
  _applyVal('simular-body', `<div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Saldo Atualizado</div>
                                  <div><span class="common" id="saldoOutput">${saldo}</span></div>
                                </div>
                              </div>
                            </div>

                            <div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Trabalho</div>
                                  <div><span class="${ponto.htmlElements.hours.roundedPill}">${ponto.htmlElements.hours.value}</span></div>
                                </div>
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Intervalo</div>
                                  <div><span class="${ponto.htmlElements.interval.roundedPill}">${ponto.htmlElements.interval.value}</span></div>
                                </div>
                              </div>
                            </div>

                            <div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">EPM</div>
                                  <div><span class="common" id="saldoOutput">${ponto.epm.value}</span></div>
                                </div>
                              </div>
                            </div>

                          <div class="item-internal-messages" id="message1">
                            ${ponto.htmlElements.messagesHTML}
                          </div>`)
}