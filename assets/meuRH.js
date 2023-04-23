var index = 0;

function _meuRH(){
    let meuRH = JSON.parse(localStorage.getItem('meuRH'));
    let nameFound = false;
    let result = {};

    for (index; index < meuRH.length; index++) {
        let value = meuRH[index];
        if (value.includes("Nome: ") && !nameFound) {
            _updateName(value);
            nameFound = true;
        } else if (_isFullDate(value)) {
            _processDay(meuRH, result);
        } else if (value == "Banco de Horas") {
            _processBancoDeHoras(meuRH, result);
            break;
        }
    }
    console.log(result);
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

function _processDay(meuRH, result) {
    let key = _removeYear(meuRH[index]);
    let value = 0;
    index++;

    let time1 = "";
    let time2 = "";


    for (index; index < meuRH.length; index++) {
        let value = meuRH[index];
        if (_isFullDate(value) || value == "Banco de Horas") {
            break;
        } else {
            if (value){
                if (time1 == "") {
                    time1 = value;
                } else {
                    time2 = value;
                    value += _extractNumber(time1, time2);
                    time1 = "";
                    time2 = "";
                }
            }
        }
    }

    result[key] = value;
}

function _processBancoDeHoras(meuRH, result){

}
