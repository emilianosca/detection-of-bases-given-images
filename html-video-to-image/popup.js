const popup = document.getElementById('popup');
const popupTimer = document.getElementById('popup-timer');
const closePopupBtn = document.getElementById('close-popup');
const closePopupBtnTimer = document.getElementById('close-popup-timer');


function openPopUp() {
    popup.style.display = "block";
}

function openPopUpTimer() {
    popup.style.display = "block";
}

closePopupBtn.addEventListener('click', () => {
    popup.style.display = "none";    
});

closePopupBtnTimer.addEventListener('click', () => {
    popup.style.display = "none";
});