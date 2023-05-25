function _epm(rawData="") {
    try {
        let week = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
        let result = {
            system: {},
            keypoints: {}
        };
        if (rawData) {
            for (let i = 0; i < rawData[0].length; i++) {
                let split = rawData[0][i].split(" ");
                if (split.length == 2 && week.includes(split[0])) {
                    let key = split[1];
                    let sum = 0;
                    for (let j = 1; j < rawData.length; j++) {
                        let value = rawData[j][i];
                        if (value) {
                            sum += _epmToNumber(value);
                        }
                    }
                    // round number to 1 decimal place
                    result["system"][key] = _numberToEpm(sum);
                }
            }
            _updateYearEPM(result);
            _updateKeypoints(result);
            localStorage.setItem('epm-result', JSON.stringify(result));
            _start();
        }
    } catch (e){
        _start();
        _logger(ERROR, e.message || e.toString());
    }
}

function _updateYearEPM(epm){
    let result = {
        system: {}
    };
    let keys = Object.keys(epm["system"]);
    let year = parseInt(_getLocal('year'));
    let startMonth = parseInt(keys[0].split("/")[1]);

    for (let key of keys){
        let month = parseInt(key.split("/")[1]);
        let newKey;
        if (month <= startMonth){
            newKey = key + "/" + year;
        } else {
            newKey = key + "/" + (year+1);
        }
        result["system"][newKey] = epm["system"][key];
    }

    epm["system"] = result["system"];
}

function _deleteEPM(){
    localStorage.removeItem('epm-result');
    _start();
}