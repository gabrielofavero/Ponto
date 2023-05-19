function _startVisualizar(){
    let regime = _getRegime();
    let saldo = _getSaldo();
    let periodo = _getPeriodo();

    if (regime){
        document.getElementById('regime').innerHTML = regime;
    }

    if (saldo){
        document.getElementById('saldo').innerHTML = saldo;
    }

    if (periodo){
        document.getElementById('periodo').innerHTML = _getPeriodoString();
    }

}

function _getRegime(){
    let job = _getLocal('job');
    if(job && (job.toLowerCase().includes('estagiário') || job.toLowerCase().includes('estagio'))){
        job = 'Estagiário';
    } else {
        job = 'CLT';
    }
    return job;
}

function _getSaldo(){
    const meuRH = _getLocal('meuRH-result');
    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Saldo Atual']){
        return meuRH['keypoints']['Saldo Atual'];
    } else return "";
}

function _getPeriodo(){
    let result = {
        start: "",
        end: ""
    }

    const meuRH = _getLocal('meuRH-result');
    const epm = _getLocal('epm-result');
    const manual = _getLocal('manual-result');

    let startMeuRH;
    let endMeuRH;
    let startEPM;
    let endEPM;
    let startManual;
    let endManual;

    if (meuRH && meuRH['keypoints'] && meuRH['keypoints']['Início'] && meuRH['keypoints']['Fim']){
        startMeuRH = _getDate(meuRH['keypoints']['Início']);
        endMeuRH = _getDate(meuRH['keypoints']['Fim']);
    }

    if (epm && epm['keypoints'] && epm['keypoints']['Início'] && epm['keypoints']['Fim']){
        startEPM = _getDate(epm['keypoints']['Início']);
        endEPM = _getDate(epm['keypoints']['Fim']);
    }

    if (manual && manual['keypoints'] && manual['keypoints']['Início'] && manual['keypoints']['Fim']){
        startManual = _getDate(manual['keypoints']['Início']);
        endManual = _getDate(manual['keypoints']['Fim']);
    }

    let start = _getEarliest([startMeuRH, startEPM, startManual]);
    let end = _getLatest([endMeuRH, endEPM, endManual]);

    result.start = _dateToDateStringNoYear(start);
    result.end = _dateToDateStringNoYear(end);

    return result;
}

function _getPeriodoString(){
    let periodo = _getPeriodo();
    return periodo.start + " - " + periodo.end;
}