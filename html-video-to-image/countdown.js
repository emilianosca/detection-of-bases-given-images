let startingSeconds = 45;

const countDownSpan = document.getElementById('countdown');

function countdown() {
    if (startingSeconds == 0) {
        myStopFunction();
        openPopUpTimer();
    } else {    
        startingSeconds--;
        if (startingSeconds <= 9) {
            countDownSpan.innerText = "0" + startingSeconds;
        } else {
            countDownSpan.innerText = startingSeconds;
        }        
    }
}

function myStopFunction() {
    clearTimeout(myInterval);
}

// const myInterval = setInterval(countdown, 1000);