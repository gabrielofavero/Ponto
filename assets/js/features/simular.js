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
        _loadSimWarning("Insira no mínimo 1 ponto para simular.")
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
    const PUNCHES = _getPunches(punches, messages);
    console.log(PUNCHES);
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

function _loadSimWarning(text){
    _applyVal('simular-body',`<div class="alert alert-warning alert-dismissible fade show" role="alert">${text}</div>`)
}

function _loadSimHTML(saldo, ponto){
    _applyVal('simular-body', `<div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Saldo Atualizado</div>
                                  <div><span class="common" id="saldoOutput">${ponto.saldo}</span></div>
                                </div>
                              </div>
                            </div>

                            <div class="item-comparison-container" id="sumUp-container1">
                              <div class="item-comparison-table">
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Trabalho</div>
                                  <div><span class="common">08:18</span></div>
                                </div>
                                <div class="item-internal-container">
                                  <div class="item-comparison-title">Intervalo</div>
                                  <div><span class="common">01:12</span></div>
                                </div>
                              </div>
                            </div>

                            <div class="item-comparison-container" id="punchesTable1">

                              <div class="item-comparison-table" id="item-comparison-table1" "="">
                              <div class=" item-internal-container">
                                <div class="item-comparison-title">Entrada</div>
                                <div id="entradas1">
                                  <span class="common" id="e-1-0">09:19</span><br><span class="common"
                                    id="e-1-2">12:09</span>
                                </div>
                              </div>
                              <div class="item-internal-container">
                                <div class="item-comparison-title">Saída</div>
                                <div id="saidas1">
                                  <span class="common" id="s-1-1">10:57</span><br><span class="common"
                                    id="s-1-3">18:49</span>
                                </div>
                              </div>
                              <div class="item-internal-container">
                                <div class="item-comparison-title">Intervalo</div>
                                <div id="intervalo1">
                                  <span class="common" id="i-1-2">01:12</span><br>-
                                </div>
                              </div>
                            </div>
                            <div class="item-internal-footer">
                              <span class="item-comparison-title">Batidas: </span><span class="common">4</span>
                            </div>

                          <div class="item-comparison-container">
                            <div class="item-comparison-table">
                              <div class="item-internal-container">
                                <div class="item-comparison-title">EPM</div>
                                <div><span class="common">8,3</span></div>
                              </div>
                            </div>
                          </div>

                          <div class="item-internal-messages" id="message1">

                          </div>`)
}