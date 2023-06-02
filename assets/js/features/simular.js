function _startSimular() {
  _loadSimularPlaceHolders();
  _loadSimularEventListeners();
  _loadSimularURLParameters();
}

function _loadSimularPlaceHolders() {
  const input = document.getElementById('periodoInput');
  const today = new Date().toISOString().substring(0, 10);
  input.value = today;

  const regimes = REGIMES_JSON;
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
  const periodoInput = _getInnerHTML('periodoInput');
  const meuRH = _getLocal('meuRH');

  if (periodoInput) {
    let messages = [];

    const regime = _getInnerHTML('regimeInput');
    const saldo = _getInnerHTML('saldoInput');
    const periodo = _dateInputToDateString(_getInnerHTML('periodoInput'));
    const dayOfTheWeek = periodo ? _getDayOfTheWeek(periodo) : "";
    const punches = _getSimPunches();
    let observation = meuRH ? meuRH["system"][periodo]["observation"] : "";

    _setInnerHTML('simular-date', periodo);
    _setInnerHTML('simular-dayOfTheWeek', dayOfTheWeek);

    if (punches.length > 0) {
      if (observation) {
        _loadSimObservation(observation, messages);
      }
      if (dayOfTheWeek == "Sábado" || dayOfTheWeek == "Domingo") {
        _loadSimDayOfTheWeek(dayOfTheWeek, messages);
      }
      _loadPontoSim(regime, saldo, punches, observation, messages);
    } else {
      _loadSimWarning("Insira no mínimo 1 ponto para simular.");
    }
  } else {
    _loadSimWarning("Insira uma data válida para simular.")
  }
}

function _loadSimObservation(observation, messages) {
  messages.push(MESSAGES_JSON.observation);
  _addClass('simular-observation', BADGES_JSON.info.roundedPill);
  _removeClass('simular-observation', "gray");
  _setInnerHTML('simular-observation', observation);
}

function _loadSimDayOfTheWeek(dayOfTheWeek, messages) {
  const translation = dayOfTheWeek == "Sábado" ? "saturday" : "sunday";
  messages.push(MESSAGES_JSON[translation]);
  _addClass('simular-dayOfTheWeek', BADGES_JSON.info.roundedPill);
  _removeClass('simular-dayOfTheWeek', "gray");
}

function _loadSimularEventListeners() {
  const simular = document.getElementById('simular-button');
  simular.addEventListener('click', function () {
    _applySimulation();
  });
  _resizeRegime();
}

function _loadPontoSim(regime, currentSaldo, punchesArray, observation, messages) {
  let ponto;
  if (PONTO_JSON) {
    ponto = JSON.parse(JSON.stringify(PONTO_JSON));
  } else {
    ponto = _getJSON('assets/json/visualizar/Ponto.json');
  }

  const PUNCHES = _getPunches(punchesArray, messages);

  ponto.htmlElements.interval.internalRoundedPill = PUNCHES.interval.internalRoundedPill
  ponto.htmlElements.punchesTable.innerHTML = _getPunchesTableHTML(ponto, punchesArray, messages);

  ponto.htmlElements.hours.value = PUNCHES.hours.value;
  ponto.htmlElements.hours.roundedPill = PUNCHES.hours.roundedPill;
  ponto.htmlElements.hours.badge = PUNCHES.hours.badge;
  ponto.htmlElements.hours.icon = PUNCHES.hours.icon;

  ponto.htmlElements.interval.value = PUNCHES.interval.value;
  ponto.htmlElements.interval.roundedPill = PUNCHES.interval.roundedPill;
  ponto.htmlElements.interval.icon = PUNCHES.interval.icon;

  ponto.title.value = PUNCHES.hours.value;
  ponto.epm.value = _timeToEPM(PUNCHES.hours.value);

  _loadSimSaldo(ponto, currentSaldo, regime, messages);
  _loadSimMessagesHTML(ponto, messages, observation);

  _loadSimHTML(ponto);
}

function _getSimPunches() {
  let result = [];
  for (let i = 0; i < 5; i++) {
    let e = _getInnerHTML('e' + i);
    if (e) {
      result.push(e);
    }
    let s = _getInnerHTML('s' + i);
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
  _setInnerHTML('simular-body', `<div class="alert alert-warning alert-dismissible fade show" role="alert">${text}</div>`)
}

function _loadSimHTML(ponto) {
  _setInnerHTML('simular-body', `
                            <div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Novo Saldo</div>
                                  <div><span class="common" id="saldoOutput">${ponto.saldo}</span></div>
                                </div>
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">EPM</div>
                                  <div><span class="common" id="saldoOutput">${ponto.epm.value}</span></div>
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

                            <div class="item-comparison-container">
                            ${ponto.htmlElements.punchesTable.innerHTML}
                            </div>

                          <div class="item-internal-messages" id="message1">
                            ${ponto.htmlElements.messagesHTML}
                          </div>`)
}

function _loadSimularURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  let date = urlParams.get('date');
  let punches = urlParams.get('punches');

  if (date) {
    date = _dateStringToDateInput(date);
    document.getElementById("periodoInput").value = date;
  }

  if (punches) {
    punches = punches.split(",");
    let i = 0;
    let e = true;
    for (const punch of punches) {
      let type = e ? "e" : "s";
      document.getElementById(type + i).value = punch;
      if (!e) {
        i++;
      }
      e = !e;
    }
  }
}

function _loadSimSaldo(ponto, currentSaldo, regime, messages) {
  let result = "00:00";
  let hoursNumb = _timeToNumber(ponto.title.value);

  if (regime == REGIMES_JSON.estagio) {
    if (hoursNumb - 6 > 0) {
      messages.push(MESSAGES_JSON.internJourneyMismatch)
    }
  } else {
    const balance = _numberToTime(hoursNumb - 8);
    result = _sumTime([currentSaldo, balance]);
  }
  ponto.saldo = result;
}

function _loadSimMessagesHTML(ponto, messages, observation) {
  let result = [];

  if (_getSimPunches().length % 2 != 0) {
    messages.push(MESSAGES_JSON.odd);
  }
  if (messages.length == 0) {
    result.push(MESSAGE_DIVS_JSON.success.replace("#1", MESSAGES_JSON.valid));
  } else {
    for (let message of messages) {
      switch (message) {
        case MESSAGES_JSON.saturday:
        case MESSAGES_JSON.sunday:
          result.push(MESSAGE_DIVS_JSON.info.replace("#1", message));
          break;
        case MESSAGES_JSON.observation:
          result.push(MESSAGE_DIVS_JSON.info.replace("#1", message.replace("#1", observation)));
          break;
        default:
          result.push(MESSAGE_DIVS_JSON.warning.replace("#1", message));
      }
    }
  }

  ponto.htmlElements.messagesHTML = result.join("");
}