function _handleMeuRH() {

  const meuRHCard = document.getElementById('meuRH-card');
  const body = document.body;
  let showDragMessage = false;
  
  meuRHCard.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (!showDragMessage){
      showDragMessage = true;
      _setDragMessage('meuRH');
    }
  });
  
  meuRHCard.addEventListener('drop', async (event) => {
    event.preventDefault();
    _setCardContent('meuRH')
    showDragMessage = false;
    const file = event.dataTransfer.files[0];
    if (!file) return;
    
    _insertFileMeuRH(file);
  });
  
  body.addEventListener('dragover', async (event) => {
    event.preventDefault();
    if (!meuRHCard.contains(event.target) && showDragMessage) {
      _setCardContent('meuRH');
      showDragMessage = false;
    }
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
  inserMode = true;
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
  insertMode = false;
}

function _handleEPM() {
  const epmCard = document.getElementById('epm-card');
  const body = document.body;
  let showDragMessage = false;

  epmCard.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (!showDragMessage){
      showDragMessage = true;
      _setDragMessage('epm');
    }
  });

  epmCard.addEventListener('drop', async (event) => {
    event.preventDefault();
    _setCardContent('epm')
    showDragMessage = false;
    const file = event.dataTransfer.files[0];
    if (!file) return;
    _insertFileEPM(file);
  });

  body.addEventListener('dragover', async (event) => {
    event.preventDefault();
    if (!epmCard.contains(event.target) && showDragMessage) {
      _setCardContent('epm');
      showDragMessage = false;
    }
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
  inserMode = true;
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
  inserMode = false;
}

function _setDragMessage(type){
  const loadDiv = document.getElementById(`${type}-load`);
  loadDiv.style.border = '3px dashed #B8BFC4';
  loadDiv.style.padding = '20px';
  
  const cardContentDiv = document.getElementById(`${type}-card-content`);
  cardContentDiv.style.display = 'none'

  const dropBoxDiv = document.getElementById(`${type}-drop-box`);
  dropBoxDiv.style.display = 'flex'
}

function _setCardContent(type){
  const loadDiv = document.getElementById(`${type}-load`);
  loadDiv.style.border = 'none';
  loadDiv.style.padding = '0px';
  
  const cardContentDiv = document.getElementById(`${type}-card-content`);
  cardContentDiv.style.display = 'block'

  const dropBoxDiv = document.getElementById(`${type}-drop-box`);
  dropBoxDiv.style.display = 'none'
}

function _countSuccess(type) {
  switch(type){
    case "meuRH":
      countMeuRH++;
      break;
    case "epm":
      countEPM++;
      break;
  } 
}

function _getCount(type) {
  switch(type){
    case "meuRH":
      return countMeuRH;
    case "epm":
      return countEPM;
  } 
}