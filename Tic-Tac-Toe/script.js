document.addEventListener("DOMContentLoaded", () => {
    let actualPlayer = null;
    let gameEnds = false;
    const divSlots = document.querySelectorAll('div[id^="slot"]');
    const slots = document.querySelectorAll('div[id^="slot"] > button');
    const slotsPlayers = document.querySelectorAll('div[id^="slot"] > button > img');
    const winnerX = document.getElementById("winx");
    const winnerO = document.getElementById("wino");
    const draw = document.getElementById("draw");
    let winnerXCount = document.querySelector("div#winx > p.punc-div-score");
    let winnerOCount = document.querySelector("div#wino > p.punc-div-score");
    let drawCount = document.querySelector("div#draw > p.punc-div-score");
    const restartButton = document.getElementById("restartbutton");

    for (let i = 0; i < slots.length; i++) {
        slots[i].addEventListener("click", () => {
            if (slotsPlayers[i].style.scale == "" && !gameEnds) {
                notifyPlayer(slotsPlayers[i]);
                slotsPlayers[i].style.scale = ".7";

                if (checkWin()) {
                    if (actualPlayer) {
                        winnerXCount.innerText++;
                        winnerX.style.border = "2px solid #D4CBCB";
                        winnerX.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
                        winnerO.style.border = "0";
                        winnerO.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
                    } else {
                        winnerOCount.innerText++;
                        winnerO.style.border = "2px solid #D4CBCB";
                        winnerO.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
                        winnerX.style.border = "0";
                        winnerX.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
                    }
                    return;
                }
                
                if (!Array.from(slotsPlayers).some(img => img.style.scale == '')) {
                    drawCount.innerHTML = parseInt(drawCount.innerHTML) + 1;
                    winnerX.style.border = "0";
                    winnerX.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
                    winnerO.style.border = "0";
                    winnerO.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
                    draw.style.border = "2px solid #D4CBCB";
                    draw.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
                    gameEnds = true;
                    return;
                }
                
                actualPlayer = !actualPlayer;
            }
        });
    }

    restartButton.addEventListener("click", () => {
        if (actualPlayer == null) {
            return;
        }
        
        for (let i = 0; i < slots.length; i++) {
            slotsPlayers[i].style.scale = "";
            slotsPlayers[i].src = "";
            divSlots[i].classList.remove("winnerslot");
            gameEnds = false;
            notifyPlayer(slotsPlayers[0]); // Pass a random Slot (This will not affect the game).
            slotsPlayers[0].src = "";
            actualPlayer = !actualPlayer;
        }
    });

    function notifyPlayer(slot) {
        draw.style.border = "0";
        draw.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
        if (actualPlayer) {
            slot.src = "imgs/x-tictactoe.svg";
            winnerO.style.border = "2px solid #D4CBCB";
            winnerO.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
            winnerX.style.border = "0";
            winnerX.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
        } else {
            slot.src = "imgs/o-tictactoe.svg";
            winnerX.style.border = "2px solid #D4CBCB";
            winnerX.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
            winnerO.style.border = "0";
            winnerO.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
        }
    }

    function checkWin() {
        gameEnds = true;
        
        for (let i = 0; i < 3; i++) {
            if (slotsPlayers[i * 3].src == slotsPlayers[i * 3 + 1].src && slotsPlayers[i * 3 + 1].src == slotsPlayers[i * 3 + 2].src && slotsPlayers[i * 3 + 2].style.scale != "") {
                divSlots[i * 3].classList.add("winnerslot");
                divSlots[i * 3 + 1].classList.add("winnerslot");
                divSlots[i * 3 + 2].classList.add("winnerslot");
                return true;
            }

            if (slotsPlayers[i].src == slotsPlayers[i + 3].src && slotsPlayers[i + 3].src == slotsPlayers[i + 6].src && slotsPlayers[i + 6].style.scale != "") {
                divSlots[i].classList.add("winnerslot");
                divSlots[i + 3].classList.add("winnerslot");
                divSlots[i + 6].classList.add("winnerslot");
                return true;
            }
        }

        if (slotsPlayers[0].src == slotsPlayers[4].src && slotsPlayers[4].src == slotsPlayers[8].src && slotsPlayers[8].style.scale != "") {
            divSlots[0].classList.add("winnerslot");
            divSlots[4].classList.add("winnerslot");
            divSlots[8].classList.add("winnerslot");
            return true;
        }

        if (slotsPlayers[2].src == slotsPlayers[4].src && slotsPlayers[4].src == slotsPlayers[6].src && slotsPlayers[6].style.scale != "") {
            divSlots[2].classList.add("winnerslot");
            divSlots[4].classList.add("winnerslot");
            divSlots[6].classList.add("winnerslot");
            return true;
        }

        gameEnds = false;
        return false;
    }

    const playerChoosen = document.querySelectorAll('.first-player > div > button');
    for (let i = 0; i < playerChoosen.length; i++) {
        playerChoosen[i].addEventListener("click", () => { startGame(playerChoosen[i].innerHTML) });
    }

    function startGame(player) {
        actualPlayer = player == "X";
        actualPlayer = !actualPlayer;
        notifyPlayer(slotsPlayers[0]);
        slotsPlayers[0].src = "";
        actualPlayer = !actualPlayer;
        for (let i = 0; i < slots.length; i++) {
            slots[i].removeAttribute("disabled");
        }
        document.getElementsByClassName("first-player")[0].classList.toggle("player-choosen");
    }
});