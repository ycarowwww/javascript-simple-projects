document.addEventListener("DOMContentLoaded", () => {
    const controlButton = document.getElementById("control");
    const restartButton = document.getElementById("restart");
    const setTimeButton = document.getElementById("settime");
    const timeTag = document.querySelector(".time p");
    let time = timeTag.innerHTML.split(":");
    let interval = null;
    let remainingSeconds = 0;

    controlButton.addEventListener("click", () => {
        if (interval === null) {
            start();
        } else {
            stop();
        }
    });

    restartButton.addEventListener("click", () => {
        stop();
        remainingSeconds = 0;
        updateInterfaceTime();
    });

    setTimeButton.addEventListener("click", () => {
        const inputTime = prompt("Enter amount of time [00:00:00]:").split(":").map(str => parseInt(str, 10));

        stop();
        remainingSeconds = inputTime[0] * 3600 + inputTime[1] * 60 + inputTime[2];
        updateInterfaceTime();
    });

    function updateInterfaceTime() {
        const remainingTime = [Math.floor(remainingSeconds / 3600), Math.floor(remainingSeconds % 3600 / 60), remainingSeconds % 3600 % 60];
        
        for (let i = 0; i < time.length; i++) {
            time[i] = remainingTime[i].toString().padStart(2, "0");
        }
        timeTag.innerHTML = time.join(":");
    }

    function updateInterfaceControls() {
        if (interval === null) {
            controlButton.innerHTML = `<span class="material-symbols-outlined">play_arrow</span>`;
            controlButton.classList.add("start");
            controlButton.classList.remove("pause");
        } else {
            controlButton.innerHTML = `<span class="material-symbols-outlined">pause</span>`;
            controlButton.classList.add("pause");
            controlButton.classList.remove("start");
        }
    }

    function start() {
        if (remainingSeconds === 0) return;

        interval = setInterval(() => {
            remainingSeconds--;
            updateInterfaceTime();

            if (remainingSeconds === 0) {
                stop();
            }
        }, 1000);

        updateInterfaceControls();
    }

    function stop() {
        clearInterval(interval);
        interval = null;

        updateInterfaceControls();
    }
});