const controlButton = document.getElementById("control");
const restartButton = document.getElementById("restart");
const setTimeButton = document.getElementById("settime");
const timeTag = document.querySelector(".time p");
const controlButtonIcon = document.querySelector("#control span");
let time = timeTag.innerHTML.split(":");
let interval = null;
let remainingSeconds = 0;

controlButton.addEventListener("click", controlTimer);
restartButton.addEventListener("click", restartTime);
setTimeButton.addEventListener("click", setTime);

function updateInterfaceTime() {
    const remainingTime = [Math.floor(remainingSeconds / 3600), Math.floor(remainingSeconds % 3600 / 60), remainingSeconds % 3600 % 60];
    
    for (let i = 0; i < time.length; i++) {
        time[i] = remainingTime[i].toString().padStart(2, "0");
    }

    timeTag.innerHTML = time.join(":");
}

function updateInterfaceControls() {
    if (interval === null) {
        controlButtonIcon.innerHTML = "play_arrow";
        controlButton.classList.add("start");
        controlButton.classList.remove("pause");
    } else {
        controlButtonIcon.innerHTML = "pause";
        controlButton.classList.add("pause");
        controlButton.classList.remove("start");
    }
}

function controlTimer() {
    if (interval === null) startTimer();
    else stopTimer();
}

function restartTime() {
    stopTimer();
    remainingSeconds = 0;
    updateInterfaceTime();
}

function setTime() {
    let inputTime = prompt("Enter amount of time [00:00:00]:");
    
    while ((inputTime.match(/^[0-9]{2}[:][0-9]{2}[:][0-9]{2}$/g) || []).length !== 1) {
        alert("Enter a valid amount of time. Like this: 00:00:00");
        inputTime = prompt("Enter amount of time [00:00:00]:");
    }

    inputTime = inputTime.split(":").map(str => parseInt(str, 10));

    stopTimer();
    remainingSeconds = inputTime[0] * 3600 + inputTime[1] * 60 + inputTime[2];
    updateInterfaceTime();
}

function startTimer() {
    if (remainingSeconds === 0) return;

    interval = setInterval(() => {
        remainingSeconds--;
        updateInterfaceTime();

        if (remainingSeconds === 0) stopTimer();
    }, 1000);

    updateInterfaceControls();
}

function stopTimer() {
    clearInterval(interval);
    interval = null;

    updateInterfaceControls();
}