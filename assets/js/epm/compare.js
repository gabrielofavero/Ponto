function _compareData() {
    let result = {};
    const resultMeuRH = _getLocal('meuRH-result')["system"];
    const resultEPM = _getLocal('EPM-result');
    
    for (let sysKey of Object.keys(resultMeuRH)){
        let valMeuRH = resultMeuRH[sysKey];
        let valEPM = resultEPM[sysKey];
        if (valEPM && valMeuRH){
            result[sysKey] = _timeDifference(valMeuRH, valEPM)
        }
    }
    return result;
}