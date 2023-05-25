function _getLocal(localName, forceUndefined=false) {
  const noResult = forceUndefined ? undefined : "";  
  let localData = localStorage.getItem(localName);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        return localData;
      }
    } else {
      return noResult;
    }
  }
  
  function _getJSON(path) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
  
    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else {
      _logger(ERROR, "Failed to load JSON file in path: '" + path, "'")
    }
  }

  function _getFirstCharUpperCase(text){
    text = text.toLowerCase();
    var words = text.split(' ');
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    let result = words.join(' ').trim();

    if (!result.includes(" ") && result.includes(".")){
      return result.toUpperCase();
    }

    return result;
  }