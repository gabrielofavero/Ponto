const VERSION = '1.0.0';
const DATABASE_VERSION_LIMIT = "1.0.0";
const VERSION_DATE = "02/06/2023";
const MAJOR_RELEASE = true;

// === Main Function ===
function _startReleaseNotesHTML() {
    _setInnerHTML("releaseNotes", 'Release Notes - v' + VERSION);
    _setInnerHTML("releaseNotes-breadcrumb", 'v' + VERSION);
    _setInnerHTML("versaoOutput", VERSION);
    _setInnerHTML("lancamentoOutput", VERSION_DATE);
}

// === Loaders ===
function _loadVersion() {
    let result = {};
    _setInnerHTML("version", "v" + VERSION);
    const version = _getLocal("version");
    if (version && version[VERSION]) {
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
        let date = _dateStringToDate(VERSION_DATE);
        let today = new Date();
        if (today.getTime() - date.getTime() <= twoDaysInMilliseconds && MAJOR_RELEASE) {
            _loadNewIcon()
        }
    } else {
        result[VERSION] = VERSION_DATE;
        localStorage.setItem("version", JSON.stringify(result));
    }
}

function _loadNewIcon() {
    _addClass("newVersion", "bi bi-exclamation exclamation");
    _setStyle("newVersion", "color: red;");
}

// === Verifiers ===
function _isVersionValid(database) {
    let result = true;
    if (database && database["keypoints"] && database["keypoints"]["Version"] && _isVersionOlderThan(database["keypoints"]["Version"])) {
        result = false;
    }
    return result;
}

function _isVersionOlderThan(version) {
    let result = false;
    if (version) {
        let split = version.split(".");
        let split2 = DATABASE_VERSION_LIMIT.split(".");
        for (let i = 0; i < split.length; i++) {
            if (split[i] < split2[i]) {
                result = true;
                break;
            }
        }
    }
    return result;
}