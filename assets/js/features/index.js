const NAO_CARREGADO_JSON = _getJSON('assets/json/index/Não Carregado.json');
const CARREGADO_JSON = _getJSON('assets/json/index/Carregado.json');
const ERRO_JSON = _getJSON('assets/json/index/Erro.json');
const DATAS_JSON = _getJSON('assets/json/index/Datas.json');

function _startIndex() {
    const meuRH = _getLocal("meuRH-result");
    const epm = _getLocal("epm-result");
    if (meuRH) {
        _setLoaded('meuRH');
        _loadedButtons('meuRH');
    } else {
        _setNotLoaded('meuRH');
        _unloadedButtons('meuRH')
    }

    if (epm) {
        _setLoaded('epm');
        _loadedButtons('epm');
    } else {
        _setNotLoaded('epm');
        _unloadedButtons('epm')
    }

    _setYear();
    if (meuRH && epm) {
        _checkOverlap();
    }
}

function _setLoaded(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    let result = _getLocal(type + '-result')
    if (result && result["keypoints"] && result["keypoints"]["Início"] && result["keypoints"]["Fim"]) {
        let start = _dateStringToDateStringNoYear(result["keypoints"]["Início"]);
        let end = _dateStringToDateStringNoYear(result["keypoints"]["Fim"]);
        badge.innerHTML = CARREGADO_JSON.badge;
        message.innerHTML = CARREGADO_JSON.message.replace('#1', start).replace('#2', end);
    } else {
        badge.innerHTML = ERRO_JSON.badge;
        message.innerHTML = ERRO_JSON.message;
    }
}

function _setNoOverlap() {
    document.getElementById("overlaping").style.display = "block";
    const meuRH = document.getElementById("meuRH-status-badge");
    const epm = document.getElementById("epm-status-badge");
    if (meuRH) {
        meuRH.innerHTML = DATAS_JSON.badge;
    }
    if (epm) {
        epm.innerHTML = DATAS_JSON.badge;
    }
    _hideNav("meuRH");
    _hideNav("epm");
}

function _setOverlap() {
    document.getElementById("overlaping").style.display = "none";
    _restoreBadge("meuRH");
    _restoreBadge("epm");
}

function _updateKeypoints(result) {
    if (result && result.system && Object.keys(result.system).length > 1) {
        let systemKeys = Object.keys(result.system);
        systemKeys.sort((a, b) => a - b);
        result["keypoints"]["Início"] = systemKeys[0];
        result["keypoints"]["Fim"] = systemKeys[systemKeys.length - 1];
    }
}

function _restoreBadge(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    const currentMessage = message.innerHTML;
    if (currentMessage) {
        if (currentMessage == NAO_CARREGADO_JSON.message) {
            badge.innerHTML = NAO_CARREGADO_JSON.badge;
        } else if (currentMessage.includes('Período:')) {
            badge.innerHTML = CARREGADO_JSON.badge;
        } else if (currentMessage == ERRO_JSON.message) {
            badge.innerHTML = ERRO_JSON.badge;
        }
    }
}

function _setYear() {
    const local = _getLocal("year");
    if (!local) {
        localStorage.setItem("year", (new Date()).getFullYear());
    }
}

function _loadedButtons(type){
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "";
  }
  
  function _unloadedButtons(type){
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "none"
  }