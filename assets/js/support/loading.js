function _startLoad() {
    document.getElementById("loading-container").style.display = "flex";
    document.getElementById("main-container").style.display = "none";
}

function _endLoad() {
    document.getElementById("loading-container").style.display = "none";
    document.getElementById("main-container").style.display = "block";
}

function _isLoading(){
    const display = document.getElementById("main-container").style.display;
    return display === "none" || display === "";
}