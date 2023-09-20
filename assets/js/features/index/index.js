const INDEX_BADGES_JSON = _getJSON('assets/json/index/Index Badges.json');

var indexBoot = true;

var countMeuRH = 0;
var countEPM = 0;
var insertMeuRH = false;
var insertEPM = false;

// === Main Function ===
function _startIndex() {

    if (indexBoot){
        indexBoot = false;
        _handleMeuRH();
        _handleEPM();
    }

    const meuRH = _getLocal("meuRH");
    const epm = _getLocal("epm");

    const versionValidMeuRH = _isVersionValid(meuRH);
    const versionValidEPM = _isVersionValid(epm);

    _loadIndexEventListeners();

    if (meuRH && versionValidMeuRH) {
        _setLoaded('meuRH');
        _loadedButtons('meuRH');
    } else if (versionValidMeuRH) {
        _setBadgeMessage('meuRH', 'naoCarregado');
        _unloadedButtons('meuRH');
    } else {
        _setBadgeMessage('meuRH', 'carregueNovamente');
        _loadedButtons('meuRH');
    }

    if (epm && versionValidEPM) {
        _setLoaded('epm');
        _loadedButtons('epm');
    } else if (versionValidEPM) {
        _setBadgeMessage('epm', 'naoCarregado');
        _unloadedButtons('epm');
    } else {
        _setBadgeMessage('epm', 'carregueNovamente');
        _loadedButtons('epm');
    }

    _setYear();
    if (meuRH && epm && versionValidMeuRH && versionValidEPM) {
        _checkOverlap();
    }
    indexBoot = false;
}

// === Loaders ===
function _loadIndexEventListeners() {
    const deleteMeuRH = document.getElementById('meuRH-delete');
    deleteMeuRH.addEventListener('click', function () {
        localStorage.removeItem('meuRH');
        countMeuRH = -1;
        _setOverlap();
        _start();
    });

    const deleteEPM = document.getElementById('epm-delete');
    deleteEPM.addEventListener('click', function () {
        localStorage.removeItem('epm');
        countEPM = -1;
        _setOverlap();
        _start();
    });
}

function _loadedButtons(type) {
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "";

    const iconDiv = document.getElementById(type + "-icon");
    iconDiv.style.display = "none";

    const iconAddDiv = document.getElementById(type + "-icon-add");
    iconAddDiv.style.display = "";
}

function _unloadedButtons(type) {
    const deleteDiv = document.getElementById(type + "-delete");
    deleteDiv.style.display = "none"

    const iconDiv = document.getElementById(type + "-icon");
    iconDiv.style.display = "";

    const iconAddDiv = document.getElementById(type + "-icon-add");
    iconAddDiv.style.display = "none";
}

// === Setters ===
function _setLoaded(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    let result = _getLocal(type)
    const previousBadge = badge.innerHTML;
    if (result && result["keypoints"] && result["keypoints"]["Início"] && result["keypoints"]["Fim"]) {
        let start = _dateStringToDateStringNoYear(result["keypoints"]["Início"]);
        let end = _dateStringToDateStringNoYear(result["keypoints"]["Fim"]);

        if (!badge.innerHTML || !badge.innerHTML.includes("Atualizado")) {
            badge.innerHTML = INDEX_BADGES_JSON["carregado"].badge;
        }
        
        message.innerHTML = INDEX_BADGES_JSON["carregado"].message.replace('#1', start).replace('#2', end);
        
        if (insertMeuRH || insertEPM) {
            _disableInsert(type);
            _countSuccess(type);
            let count = _getCount(type);
            if (previousBadge == INDEX_BADGES_JSON["carregado"].badge) {
                badge.innerHTML = INDEX_BADGES_JSON["atualizado"].badge;
            } else if (previousBadge.includes("Atualizado")) {
                badge.innerHTML = INDEX_BADGES_JSON["atualizadoMulti"].badge.replace('#1', count);
            }
        }

    } else {
        badge.innerHTML = INDEX_BADGES_JSON["erroGenerico"].badge;
        message.innerHTML = INDEX_BADGES_JSON["erroGenerico"].message;
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
    localStorage.setItem("compare", "false");
}

function _setBadgeMessage(type, indexBadgeItem) {
    const badge = document.getElementById(`${type}-status-badge`);
    const message = document.getElementById(`${type}-status-message`);
    badge.innerHTML =  INDEX_BADGES_JSON[indexBadgeItem].badge;
    message.innerHTML =  INDEX_BADGES_JSON[indexBadgeItem].message;
}

function _setOverlap() {
    document.getElementById("overlaping").style.display = "none";
    _restoreBadge("meuRH");
    _restoreBadge("epm");
    localStorage.setItem("compare", "true");
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
    const badge = document.getElementById(type + "-status-badge");
    const message = document.getElementById(type + "-status-message");
    const currentMessage = message.innerHTML;
    const badgeText = badge.innerText;

    if (!badgeText.includes("Atualizado")) {
        if (currentMessage.includes('Período:')){
            badge.innerHTML = INDEX_BADGES_JSON["carregado"].badge;
        } else {
            const keys = Object.keys(INDEX_BADGES_JSON)
            for (let key of keys) {
                if (currentMessage === INDEX_BADGES_JSON[key].message){
                    badge.innerHTML = INDEX_BADGES_JSON[key].badge;
                    break;
                }
            }
        }
    }
}

function _setYear() {
    const local = _getLocal("year");
    if (!local) {
        localStorage.setItem("year", (new Date()).getFullYear());
    }
}