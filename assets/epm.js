function _epm() {
    let epm = JSON.parse(localStorage.getItem('EPM'));
    let week = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
    let result = {};

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
            result[key] = _numberToTime(sum);
        }
    }
    console.log(result);
    localStorage.setItem('EPM-result', JSON.stringify(result));
}