function _startSimular(){
    _loadSimularPlaceHolders();
    _loadSimularEventListeners();
}

function _loadSimularPlaceHolders(){
    let input = document.getElementById('periodoInput');
    let today = new Date().toISOString().substring(0, 10);
    input.value = today;
}

function _loadSimularEventListeners() {
    _resizeRegime();
}