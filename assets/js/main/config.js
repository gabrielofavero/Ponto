const VERSION = '1.1.2';
const DATABASE_VERSION_LIMIT = "1.1.2";
const VERSION_DATE = "02/10/2023";
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
    if (database && database["keypoints"] && database["keypoints"]["Version"]) {
        return _isDatabaseVersionValid(database["keypoints"]["Version"])
    } else return true;
}

function _isDatabaseVersionValid(databaseVersion) {
    if (databaseVersion) {
        let databaseVersionSplit = databaseVersion.split(".");
        let limitSplit = DATABASE_VERSION_LIMIT.split(".");
        for (let i = 0; i < 3; i++) {
            if (databaseVersionSplit[i] < limitSplit[i]){
                return false;
            }
        }
    }
    return true;
}