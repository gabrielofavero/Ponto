function _meuRH(){
    let meuRH = JSON.parse(localStorage.getItem('meuRH'));
    let nameFound = false;
    let result = {};
    let i = 0;

    for (i; i < meuRH.length; i++) {
        let value = meuRH[i];
        if (value.includes("Nome: ") && !nameFound) {
            _updateName(value);
            nameFound = true;
        } else if (_isFullDate(value)) {
            _processDay(meuRH, result, i);
        } else if (value == "Banco de Horas") {
            _processBancoDeHoras(meuRH, result, i);
            break;
        }
    }
    localStorage.setItem('meuRH-result', JSON.stringify(result));
}

function _updateName(value) {
    let name = value.split(": ")[1];
    let split = name.split(" ");
    for (let i = 0; i < split.length; i++) {
        split[i] = split[i].charAt(0).toUpperCase() + split[i].slice(1).toLowerCase();
    }
    localStorage.setItem('name', split[0]);
    localStorage.setItem('fullName', split.join(" "));
}

function _processDay(meuRH, result, i) {
    let ENTRADA = "e";
    let SAIDA = "s";

    let key = _removeYear(meuRH[i]);
    let system = {
        [key]: {}
    };
    i++;

    let e = 0;
    let s = 0;

    for (i; i < meuRH.length; i++) {
        let value = meuRH[i];
        if (_isFullDate(value) || value == "Banco de Horas") {
            break;
        } else {
            if (value && value.split(":").length == 2){
                if (e == s) {
                    e++;
                    system[key][ENTRADA + e] = value;
                } else {
                    s++;
                    system[key][SAIDA + s] = value;
                }
                }
            }
        }
        result["system"] = Object.assign({}, result["system"], system);
    }

function _processBancoDeHoras(meuRH, result, i){
    let keys = [];
    let values = [];
    let keysFound = false;
    let innerResult = {};
    i++;

    for (i; i < meuRH.length; i++) {
        let value = meuRH[i].replace(",", ".");
        if (value) {
            if (isNaN(value) && !keysFound) {
                keys.push(value);
            } else if (!isNaN(value)) {
                keysFound = true;
                values.push(_numberToTime(parseFloat(value)));
            } else {
                break;
            }
        }
    }
    for (let j = 0; j < keys.length; j++) {
        innerResult[keys[j]] = values[j];
    }
    result["keypoints"] = innerResult;
}

function _getDayTime(day, dayObj) {
    let size = Object.keys(dayObj) / 2;
    let timeArray = [];

    if (size % 2 == 0) {
        for (let i = 1; i <= size; i++ ) {
            let entrada = dayObj["e"+i];
            let saida = dayObj["s"+i];
    
            if (entrada && saida) {
                timeArray.push(_timeDifference(entrada, saida));
            } else {
                _logger(ERROR, "Ponto inconsistente: " + day);
                return "Inconsistente";
            }
        }
    } else {
        _logger(ERROR, "Marcações Ímpares: " + day);
        return "Ímpar";
    }

    return _sumTime(timeArray);
}