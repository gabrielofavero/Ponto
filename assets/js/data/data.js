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