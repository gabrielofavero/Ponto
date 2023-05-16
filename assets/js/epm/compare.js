function _compareData() {
    let result = {};
    const resultMeuRH = _getLocal('meuRH-result')["system"];
    const resultEPM = _getLocal('EPM-result')["system"];
    
    for (let sysKey of Object.keys(resultMeuRH)){
        let valMeuRH = resultMeuRH[sysKey];
        let valEPM = resultEPM[sysKey];
        if (valEPM && valMeuRH){
            result[sysKey] = _timeDifference(valMeuRH, valEPM)
        }
    }
    return result;
}

function _checkOverlap(){
    const keypointsMeuRH = _getLocal('meuRH-result')["keypoints"];
    const keypointsEPM = _getLocal('EPM-result')["keypoints"];

    const defaultYear = 2023;
    const defaultNextYear = 2024;

    let meuRHStart = keypointsMeuRH["Início"];
    let meuRHEnd = keypointsMeuRH["Fim"];

    let epmStart = keypointsEPM["Início"];
    let epmEnd = keypointsEPM["Fim"];

    if (meuRHStart && meuRHEnd && epmStart && epmEnd) {
        const [dia1, mes1] = meuRHStart.split('/').map(Number);
        const [dia2, mes2] = meuRHEnd.split('/').map(Number);
        const [dia3, mes3] = epmStart.split('/').map(Number);
        const [dia4, mes4] = epmEnd.split('/').map(Number);
        
        const ano1 = defaultYear;
        const ano2 = (mes2 == 1 && mes1 > mes2) ? defaultNextYear : defaultYear;
        const ano3 = defaultYear;
        const ano4 = (mes4 == 1 && mes3 > mes4) ? defaultNextYear : defaultYear;

        const startDate1 = new Date(ano1, mes1 - 1, dia1);
        const endDate1 = new Date(ano2, mes2 - 1, dia2);
        const startDate2 = new Date(ano3, mes3 - 1, dia3);
        const endDate2 = new Date(ano4, mes4 - 1, dia4);

        const isOvelapping = (startDate1 <= endDate2 && endDate1 >= startDate2) || (startDate2 <= endDate1 && endDate2 >= startDate1)

        if (!isOvelapping){
            document.getElementById("overlaping").style.display = "block";
        }
    }
}

function checkOverlap(start1, end1, start2, end2) {
    const [day1, month1] = start1.split('/').map(Number);
    const [day2, month2] = end1.split('/').map(Number);
    const [day3, month3] = start2.split('/').map(Number);
    const [day4, month4] = end2.split('/').map(Number);
  
    const startDate1 = new Date(new Date().getFullYear(), month1 - 1, day1);
    const endDate1 = new Date(new Date().getFullYear(), month2 - 1, day2);
    const startDate2 = new Date(new Date().getFullYear(), month3 - 1, day3);
    const endDate2 = new Date(new Date().getFullYear(), month4 - 1, day4);
  
    return (
      (startDate1 <= endDate2 && endDate1 >= startDate2) ||
      (startDate2 <= endDate1 && endDate2 >= startDate1)
    );
  }