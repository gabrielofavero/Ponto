const INDEX_BADGES_JSON = _getJSON('assets/json/index/Index Badges.json');

function _startIndex() {
    const meuRH = _getLocal("meuRH");
    const epm = _getLocal("epm");

    const meuRHValid = _isVersionValid(meuRH);
    const epmValid = _isVersionValid(epm);

    _loadIndexEventListeners();


        if (meuRH && meuRHValid) {
            _setLoaded('meuRH');
            _loadedButtons('meuRH');
        } else if (meuRHValid) {
            _setNotLoaded('meuRH');
            _unloadedButtons('meuRH');
        } else {
            _setLoadAgain('meuRH');
            _loadedButtons('meuRH');
        }

    if (epm && epmValid) {
        _setLoaded('epm');
        _loadedButtons('epm');
    } else if (epmValid) {
        _setNotLoaded('epm');
        _unloadedButtons('epm');
    } else {
        _setLoadAgain('epm');
        _loadedButtons('epm');
    }

    _setYear();
    if (meuRH && epm && meuRHValid && epmValid) {
        _checkOverlap();
    }
}

function _loadIndexEventListeners() {
    const deleteMeuRH = document.getElementById('meuRH-delete');
    deleteMeuRH.addEventListener('click', function () {
        localStorage.removeItem('meuRH');
        _start();
    });

    const deleteEPM = document.getElementById('epm-delete');
    deleteEPM.addEventListener('click', function () {
        localStorage.removeItem('epm');
        _start();
    });
}

function _setLoaded(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    let result = _getLocal(type)
    if (result && result["keypoints"] && result["keypoints"]["Início"] && result["keypoints"]["Fim"]) {
        let start = _dateStringToDateStringNoYear(result["keypoints"]["Início"]);
        let end = _dateStringToDateStringNoYear(result["keypoints"]["Fim"]);
        badge.innerHTML = INDEX_BADGES_JSON["carregado"].badge;
        message.innerHTML = INDEX_BADGES_JSON["carregado"].message.replace('#1', start).replace('#2', end);
    } else {
        badge.innerHTML = INDEX_BADGES_JSON["erro"].badge;
        message.innerHTML = INDEX_BADGES_JSON["erro"].message;
    }
}

function _setNoOverlap() {
    document.getElementById("overlaping").style.display = "block";
    const meuRH = document.getElementById("meuRH-status-badge");
    const epm = document.getElementById("epm-status-badge");
    if (meuRH) {
        meuRH.innerHTML = INDEX_BADGES_JSON["datas"].badge;
    }
    if (epm) {
        epm.innerHTML = INDEX_BADGES_JSON["datas"].badge;
    }
    _hideMeuRH();
    _hideEPM();
}

function _setOverlap() {
    document.getElementById("overlaping").style.display = "none";
    _restoreBadge("meuRH");
    _restoreBadge("epm");
}

function _updateKeypoints(result) {
    if (result) {
        result["keypoints"]["Version"] = VERSION;
        if (result.system && Object.keys(result.system).length > 1) {
            let systemKeys = Object.keys(result.system);
            systemKeys.sort((a, b) => a - b);
            result["keypoints"]["Início"] = systemKeys[0];
            result["keypoints"]["Fim"] = systemKeys[systemKeys.length - 1];
        }
    }
}

function _restoreBadge(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    const currentMessage = message.innerHTML;
    if (currentMessage) {
        if (currentMessage == INDEX_BADGES_JSON["naoCarregado"].message) {
            badge.innerHTML = INDEX_BADGES_JSON["naoCarregado"].badge;
        } else if (currentMessage.includes('Período:')) {
            badge.innerHTML = INDEX_BADGES_JSON["carregado"].badge;
        } else if (currentMessage == INDEX_BADGES_JSON["erro"].message) {
            badge.innerHTML = INDEX_BADGES_JSON["erro"].badge;
        }
    }
}

function _setYear() {
    const local = _getLocal("year");
    if (!local) {
        localStorage.setItem("year", (new Date()).getFullYear());
    }
}

function _loadedButtons(type) {
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "";
}

function _unloadedButtons(type) {
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "none"
}

function _setNotLoaded(type) {
    const badge = document.getElementById(type + "-status-badge")
    const message = document.getElementById(type + "-status-message")
    if (badge && message) {
      badge.innerHTML = INDEX_BADGES_JSON.naoCarregado.badge;
      message.innerHTML = INDEX_BADGES_JSON.naoCarregado.message;
    }
  }
  
  function _setLoadAgain(type) {
    const badge = document.getElementById(type + "-status-badge")
    const message = document.getElementById(type + "-status-message")
    if (badge && message) {
      badge.innerHTML = INDEX_BADGES_JSON.carregueNovamente.badge;
      message.innerHTML = INDEX_BADGES_JSON.carregueNovamente.message;
    }
  }