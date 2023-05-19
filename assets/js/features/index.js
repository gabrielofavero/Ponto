const NAO_CARREGADO_OBJ = {
    badge: `<span class="badge rounded-pill bg-warning text-dark">Não Carregado</span>`,
    message: `<span class="text-muted small pt-2">Carregue para ter acesso a todos os recursos</span>`
}

const CARREGADO_OBJ = {
    badge: `<span class="badge rounded-pill bg-success">Carregado</span>`,
    message: `<span class="text-muted small pt-2">Período: #1 - #2</span>`
}

const ERRO_OBJ = {
    badge: `<span class="badge rounded-pill bg-danger">Erro</span>`,
    message: `<span class="text-muted small pt-2">O arquivo não foi carregado corretamente. Tente novamente</span>`
}

const DATAS_BADGE = `<span class="badge rounded-pill bg-danger">Datas Não Batem</span>`;

function _startIndex() {
    const meuRH = _getLocal("meuRH");
    const epm = _getLocal("epm");
    if (meuRH) {
        _setLoaded('meuRH');
    } else {
        _setNotLoaded('meuRH');
    }

    if (epm) {
        _setLoaded('epm');
    } else {
        _setNotLoaded('epm');
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
        badge.innerHTML = CARREGADO_OBJ.badge;
        message.innerHTML = CARREGADO_OBJ.message.replace('#1', start).replace('#2', end);
    } else {
        badge.innerHTML = ERRO_OBJ.badge;
        message.innerHTML = ERRO_OBJ.message;
    }
}

function _setNoOverlap() {
    document.getElementById("overlaping").style.display = "block";
    const meuRH = document.getElementById("meuRH-status-badge");
    const epm = document.getElementById("epm-status-badge");
    if (meuRH) {
        meuRH.innerHTML = DATAS_BADGE;
    }
    if (epm) {
        epm.innerHTML = DATAS_BADGE;
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

function _showLogin() {
    document.getElementById("name").innerHTML = _getLocal("name");
    document.getElementById("fullName").innerHTML = _getLocal("fullName");
    document.getElementById("login").style.display = "block";
}

function _restoreBadge(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    const currentMessage = message.innerHTML;
    if (currentMessage) {
        if (currentMessage == NAO_CARREGADO_OBJ.message) {
            badge.innerHTML = NAO_CARREGADO_OBJ.badge;
        } else if (currentMessage.includes('Período:')) {
            badge.innerHTML = CARREGADO_OBJ.badge;
        } else if (currentMessage == ERRO_OBJ.message) {
            badge.innerHTML = ERRO_OBJ.badge;
        }
    }
}

function _setYear() {
    const local = _getLocal("year");
    if (!local) {
        localStorage.setItem("year", (new Date()).getFullYear());
    }
}