
function _loadCheckboxEventListeners(){
    const accordion = document.getElementById('accordion-filter');
    accordion.addEventListener('click', function() {
        _filterVisibility();
    });
}