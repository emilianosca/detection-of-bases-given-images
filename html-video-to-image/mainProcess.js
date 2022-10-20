import * as faceSystem from './faceSystemCopy.js';
// run faceSystem every 2 seconds
const startRegisterBtn = document.getElementById('startbutton');
const formElement = document.getElementById('form');

startRegisterBtn.addEventListener('click', () => {
    const myInterval = setInterval(countdown, 1000);
    setInterval(faceSystem.faceSystem, 3000);
    formElement.style.display = "flex";
})