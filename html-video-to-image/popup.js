const popup = document.getElementById('popup');
const closePopupBtn = document.getElementById('close-popup');

function openPopUp() {
    popup.style.display = "block";
}

closePopupBtn.addEventListener('click', () => {
    popup.style.display = "none";
});