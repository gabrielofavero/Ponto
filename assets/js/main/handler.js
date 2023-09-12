function _handleMeuRH() {
  const meuRHCard = document.getElementById('meuRH-card');

  meuRHCard.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  meuRHCard.addEventListener('drop', async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    _insertFileMeuRH(file);
  });

  const inputMeuRH = document.getElementById('meuRH-input');
  
  if (inputMeuRH) {
    inputMeuRH.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      inputMeuRH.value = '';
      _insertFileMeuRH(file);
    });
  }
}

async function _insertFileMeuRH(file){
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop().toLowerCase();

  if (fileExtension === 'pdf') {
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
    _pdfMeuRH(pdfTextContent);
  } else if (fileExtension === 'html') {
    const reader = new FileReader();

    reader.onload = function (event) {
      const htmlTextContent = event.target.result;

      const inputHTML = document.createElement('div');
      inputHTML.innerHTML = htmlTextContent;

      _htmlMeuRH(inputHTML);
    };

    reader.readAsText(file);
  } else {
    console.log('Arquivo não suportado.');
  }
}

function _handleEPM() {
  const epmCard = document.getElementById('epm-card');

  epmCard.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  epmCard.addEventListener('drop', async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    _insertFileEPM(file);
  });
  
  const xlsxInput = document.getElementById('epm-input');
  if (xlsxInput) {
    xlsxInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      xlsxInput.value = '';
      _insertFileEPM(file);
    });
  }
}

function _insertFileEPM(file) {
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
    _epm(xlsxContent);
  };
  reader.readAsBinaryString(file);
}