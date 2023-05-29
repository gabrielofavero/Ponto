function _startSimular(){
    _loadSimularPlaceHolders();
    _loadSimularEventListeners();
}

function _loadSimularPlaceHolders(){
    const input = document.getElementById('periodoInput');
    const today = new Date().toISOString().substring(0, 10);
    input.value = today;

    const regimes = REGIMES || _getJSON('assets/json/visualizar/Regimes.json');
    const regimeValue= _getRegime();
    let optionComum = document.getElementById('optionComum');
    let optionEstagio = document.getElementById('optionEstagio');

    if (regimeValue && regimeValue == regimes.estagio){
        optionEstagio.selected = true;
        optionComum.selected = false;
    }

    const saldoDiv = document.getElementById('inputSaldo');
    const saldoValue = _getSaldo();

    if (saldoValue){
        saldoDiv.value = saldoValue;
    }
}

function _loadSimularEventListeners() {
    _resizeRegime();
}