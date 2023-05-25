function _compareData() {
    let result = {};
    const resultMeuRH = _getLocal('meuRH')["system"];
    const resultEPM = _getLocal('epm')["system"];

    for (let sysKey of Object.keys(resultMeuRH)) {
        let valMeuRH = resultMeuRH[sysKey];
        let valEPM = resultEPM[sysKey];
        if (valEPM && valMeuRH) {
            result[sysKey] = _timeDifference(valMeuRH, valEPM)
        }
    }
    return result;
}

function _checkOverlap() {
    const keypointsMeuRH = _getLocal('meuRH')["keypoints"];
    const keypointsEPM = _getLocal('epm')["keypoints"];

    if (keypointsMeuRH && keypointsEPM) {
        const currentYear = parseInt(_getLocal('year'));
        const nextYear = currentYear + 1;

        let meuRHStart = keypointsMeuRH["Início"];
        let meuRHEnd = keypointsMeuRH["Fim"];

        let epmStart = keypointsEPM["Início"];
        let epmEnd = keypointsEPM["Fim"];

        if (meuRHStart && meuRHEnd && epmStart && epmEnd) {
            const [day1, month1] = meuRHStart.split('/').map(Number);
            const [day2, month2] = meuRHEnd.split('/').map(Number);
            const [day3, month3] = epmStart.split('/').map(Number);
            const [day4, month4] = epmEnd.split('/').map(Number);

            const year1 = currentYear;
            const year2 = (month2 == 1 && month1 > month2) ? nextYear : currentYear;
            const year3 = currentYear;
            const year4 = (month4 == 1 && month3 > month4) ? nextYear : currentYear;

            const startDate1 = new Date(year1, month1 - 1, day1);
            const endDate1 = new Date(year2, month2 - 1, day2);
            const startDate2 = new Date(year3, month3 - 1, day3);
            const endDate2 = new Date(year4, month4 - 1, day4);

            const isOvelapping = (startDate1 <= endDate2 && endDate1 >= startDate2) || (startDate2 <= endDate1 && endDate2 >= startDate1)

            if (isOvelapping) {
                _setOverlap();
            } else {
                _setNoOverlap();
            }
        }
    }
}