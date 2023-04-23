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
            _processBancoDeHoras(meuRH, result);
            break;
        }
    }
    console.log(result);
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
    let key = _removeYear(meuRH[i]);
    let timeArray = [];
    i++;

    let time1 = "";
    let time2 = "";

    for (i; i < meuRH.length; i++) {
        let value = meuRH[i];
        if (_isFullDate(value) || value == "Banco de Horas") {
            break;
        } else {
            if (value && value.split(":").length == 2){
                if (time1 == "") {
                    time1 = value;
                } else {
                    time2 = value;
                    timeArray.push(_timeDifference(time1, time2));
                    time1 = "";
                    time2 = "";
                }
            }
        }
    }

    result[key] = _sumTime(timeArray);
}

function _processBancoDeHoras(meuRH, result, i){

}
