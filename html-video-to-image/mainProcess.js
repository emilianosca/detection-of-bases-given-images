import * as faceSystem from './faceSystemCopy.js';
// run faceSystem every 2 seconds
const startRegisterBtn = document.getElementById('startbutton');

startRegisterBtn.addEventListener('click', () => {
    setInterval(faceSystem.faceSystem, 3000);
})