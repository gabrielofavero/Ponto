function _getInnerHTML(id) {
  try {
    return document.getElementById(id).value;
  } catch (e) {
    return "";
  }
}

function _setInnerHTML(id, val) {
  document.getElementById(id).innerHTML = val;
}

function _removeClass(id, className) {
  var element = document.getElementById(id);
  if (element) {
    var classes = className.split(' ');
    classes.forEach(function (cls) {
      element.classList.remove(cls);
    });
  }
}

function _addClass(id, className) {
  var element = document.getElementById(id);
  if (element) {
    var classes = className.split(' ');
    classes.forEach(function (cls) {
      element.classList.add(cls);
    });
  }
}

function _addStyle(id, style) {
  var element = document.getElementById(id);
  if (element) {
    element.style = style;
  }
}
