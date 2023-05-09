const pdfInput = document.getElementById('pdf-input');
const xlsxInput = document.getElementById('xlsx-input');

window.onload = _start();

function _start() {
    if (_getLocal('meuRH')) {
        _meuRH();
    }
    if (_getLocal('EPM')) {
        _epm();
    }
}

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
        localStorage.setItem('EPM', JSON.stringify(xlsxContent));
        _epm();
    };
    reader.readAsBinaryString(file);
});

function _getLocal(localName){
    let localData = localStorage.getItem(localName);
    if (localData){
        return JSON.parse(localData);
    } else {
        _logger(ERROR, "Não foi possível recuperar '" + localName + "' do LocalStorage");
        return {};
    }
}