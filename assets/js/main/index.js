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
    message: `<br><span class="text-muted small pt-2">O arquivo não foi carregado corretamente. Tente novamente</span>`
}

const DATAS_BADGE = `<span class="badge rounded-pill bg-warning">Datas Não Batem</span>`;

(function () {
    "use strict";

    const pdfInput = document.getElementById('meuRH-input');
    if (pdfInput) {
        pdfInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const pdf = await pdfjsLib.getDocument({
                url: URL.createObjectURL(file)
            }).promise;
            const numPages = pdf.numPages;
            const pdfTextContent = [];

            for (let pageIndex = 1; pageIndex <= numPages; pageIndex++) {
                const page = await pdf.getPage(pageIndex);
                const
                    content = await page.getTextContent();
                const strings = content.items.map(item => item.str.trim());
                const lines = strings.join('\n').split('\n');

                for (const line of lines) {
                    pdfTextContent.push(line);
                }
            }
            localStorage.setItem('meuRH', JSON.stringify(pdfTextContent));
            _meuRH();
        });
    }
    const xlsxInput = document.getElementById('epm-input');
    if (xlsxInput) {
        xlsxInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, {
                    type: 'binary'
                });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, {
                    header: 1
                });
                const xlsxContent = [];

                for (const row of rows) {
                    xlsxContent.push(row.map(cell => cell.toString()));
                }
                localStorage.setItem('epm', JSON.stringify(xlsxContent));
                _epm();
            };
            reader.readAsBinaryString(file);
        });
    }
    window.onload = _start();
})();


function _start() {
    const meuRH = _getLocal('meuRH');
    const epm = _getLocal('epm');

    if (meuRH) {
        _meuRH();
    } else {
        _setNotLoaded('meuRH');
        _hideLogin();
    }

    if (epm) {
        _epm();
    } else {
        _setNotLoaded('epm');
    }
}

function _setLoaded(type) {
    let badge = document.getElementById(type + "-status-badge");
    let message = document.getElementById(type + "-status-message");
    let result = _getLocal(type + '-result')
    if (result && result["keypoints"] && result["keypoints"]["Início"] && result["keypoints"]["Fim"]) {
        badge.innerHTML = CARREGADO_OBJ.badge;
        message.innerHTML = CARREGADO_OBJ.message.replace('#1', result["keypoints"]["Início"]).replace('#2', result["keypoints"]["Fim"]);
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

    _hideNavs();
}

function _setOverlap() {
    document.getElementById("overlaping").style.display = "none";
    _restoreBadge("meuRH");
    _restoreBadge("epm");
}

function _setNotLoaded(type) {
    const badge = document.getElementById(type + "-status-badge")
    const message = document.getElementById(type + "-status-message")
    badge.innerHTML = `<span class="badge rounded-pill bg-warning text-dark">Não Carregado</span>`;
    message.innerHTML = `<span class="text-muted small pt-2">Carregue para ter acesso a todos os recursos</span>`
}

function _updateKeypoints(result) {
    if (result && result.system && Object.keys(result.system).length > 1) {
        let systemKeys = Object.keys(result.system);
        systemKeys.sort((a, b) => a - b);
        result["keypoints"]["Início"] = systemKeys[0];
        result["keypoints"]["Fim"] = systemKeys[systemKeys.length - 1];
    }
}

function _clearData() {
    localStorage.removeItem('meuRH');
    localStorage.removeItem('meuRH-result');
    localStorage.removeItem('epm');
    localStorage.removeItem('epm-result');
    localStorage.removeItem('name');
    localStorage.removeItem('fullName');
    _start();
}

function _showLogin() {
    document.getElementById("name").innerHTML = _getLocal("name");
    document.getElementById("fullName").innerHTML = _getLocal("fullName");
    document.getElementById("login").style.display = "block";
}

function _hideLogin() {
    document.getElementById("login").style.display = "none";
}

function _restoreBadge(type) {
    const badge = document.getElementById(type + "-status-badge");
    const message = document.getElementById(type + "-status-message");
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