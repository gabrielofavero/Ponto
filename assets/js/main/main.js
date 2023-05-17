/**
 * Template Name: NiceAdmin
 * Updated: Mar 09 2023 with Bootstrap v5.2.3
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

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
  const xlsxInput = document.getElementById('epm-input');
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

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initiate quill editors
   */
  if (select('.quill-editor-default')) {
    new Quill('.quill-editor-default', {
      theme: 'snow'
    });
  }

  if (select('.quill-editor-bubble')) {
    new Quill('.quill-editor-bubble', {
      theme: 'bubble'
    });
  }

  if (select('.quill-editor-full')) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [{
            font: []
          }, {
            size: []
          }],
          ["bold", "italic", "underline", "strike"],
          [{
            color: []
          },
          {
            background: []
          }
          ],
          [{
            script: "super"
          },
          {
            script: "sub"
          }
          ],
          [{
            list: "ordered"
          },
          {
            list: "bullet"
          },
          {
            indent: "-1"
          },
          {
            indent: "+1"
          }
          ],
          ["direction", {
            align: []
          }],
          ["link", "image", "video"],
          ["clean"]
        ]
      },
      theme: "snow"
    });
  }

  /**
   * Initiate TinyMCE Editor
   */
  const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

  tinymce.init({
    selector: 'textarea.tinymce-editor',
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
    editimage_cors_hosts: ['picsum.photos'],
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    toolbar_sticky: true,
    toolbar_sticky_offset: isSmallScreen ? 102 : 108,
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
    image_advtab: true,
    link_list: [{
      title: 'My page 1',
      value: 'https://www.tiny.cloud'
    },
    {
      title: 'My page 2',
      value: 'http://www.moxiecode.com'
    }
    ],
    image_list: [{
      title: 'My page 1',
      value: 'https://www.tiny.cloud'
    },
    {
      title: 'My page 2',
      value: 'http://www.moxiecode.com'
    }
    ],
    image_class_list: [{
      title: 'None',
      value: ''
    },
    {
      title: 'Some class',
      value: 'class-name'
    }
    ],
    importcss_append: true,
    file_picker_callback: (callback, value, meta) => {
      /* Provide file and text for the link dialog */
      if (meta.filetype === 'file') {
        callback('https://www.google.com/logos/google.jpg', {
          text: 'My text'
        });
      }

      /* Provide image and alt text for the image dialog */
      if (meta.filetype === 'image') {
        callback('https://www.google.com/logos/google.jpg', {
          alt: 'My alt text'
        });
      }

      /* Provide alternative source and posted for the media dialog */
      if (meta.filetype === 'media') {
        callback('movie.mp4', {
          source2: 'alt.ogg',
          poster: 'https://www.google.com/logos/google.jpg'
        });
      }
    },
    templates: [{
      title: 'New Table',
      description: 'creates a new table',
      content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
    },
    {
      title: 'Starting my story',
      description: 'A cure for writers block',
      content: 'Once upon a time...'
    },
    {
      title: 'New list with dates',
      description: 'New List with dates',
      content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
    }
    ],
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_class: 'mceNonEditable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image table',
    skin: useDarkMode ? 'oxide-dark' : 'oxide',
    content_css: useDarkMode ? 'dark' : 'default',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
  });

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  /**
   * Initiate Datatables
   */
  const datatables = select('.datatable', true)
  datatables.forEach(datatable => {
    new simpleDatatables.DataTable(datatable);
  })

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select('.echart', true).forEach(getEchart => {
          echarts.getInstanceByDom(getEchart).resize();
        })
      }).observe(mainContainer);
    }, 200);
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

function _getLocal(localName) {
  let localData = localStorage.getItem(localName);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      return localData;
    }
  } else {
    return "";
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

function _setNoOverlap(){
  document.getElementById("overlaping").style.display = "block";

  const meuRH = document.getElementById("meuRH-status-badge");
  const epm = document.getElementById("epm-status-badge");

  if (meuRH){
    meuRH.innerHTML = DATAS_BADGE;
  }

  if (epm){
    epm.innerHTML = DATAS_BADGE;
  }

  _hideNavs();
}

function _setOverlap(){
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

function _showNavs() {
  document.getElementById("meuRH-visualizar").style.display = "block";
  document.getElementById("epm-visualizar").style.display = "block";
}

function _hideNavs() {
  document.getElementById("meuRH-visualizar").style.display = "none";
  document.getElementById("epm-visualizar").style.display = "none";
}

function _restoreBadge(type){
  const badge = document.getElementById(type + "-status-badge");
  const message = document.getElementById(type + "-status-message");
  const currentMessage = message.innerHTML;

  if (currentMessage){
    if (currentMessage == NAO_CARREGADO_OBJ.message){
      badge.innerHTML = NAO_CARREGADO_OBJ.badge;
    } else if (currentMessage.includes('Período:')){
      badge.innerHTML = CARREGADO_OBJ.badge;
    } else if (currentMessage == ERRO_OBJ.message){
      badge.innerHTML = ERRO_OBJ.badge;
    }
  }
}