//Reveal first tab
document.getElementById('aboutUsBtn').onclick = function () {openCity(event, 'Krystal')};

// Reveal and hide tabs
function openCity(evt, cityName) {
    var currentTab, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (currentTab = 0; currentTab < tabcontent.length; currentTab++) {
        tabcontent[currentTab].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (currentTab = 0; currentTab < tablinks.length; currentTab++) {
        tablinks[currentTab].className = tablinks[currentTab].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}