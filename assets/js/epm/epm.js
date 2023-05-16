function _epm() {
    let epm = _getLocal('EPM');
    let week = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
    let result = {
        system: {},
        keypoints: {}
    };

    if (epm) {
        for (let i = 0; i < epm[0].length; i++) {
            let split = epm[0][i].split(" ");
            if (split.length == 2 && week.includes(split[0])) {
                let key = split[1];
                let sum = 0;
                for (let j = 1; j < epm.length; j++) {
                    let value = epm[j][i];
                    if (value) {
                        sum += _epmToNumber(value);
                    }
                }
                result["system"][key] = _numberToTime(sum);
            }
        }
        _updateKeypoints(result);
        console.log(result)
        localStorage.setItem('epm-result', JSON.stringify(result));
        _setLoaded('epm');
        _checkOverlap();
    } else {
        _setNotLoaded('epm');
    }
}