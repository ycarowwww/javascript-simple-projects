document.addEventListener("DOMContentLoaded", () => {
    let actualPlayer = null;
    let gameEnds = false;
    const divSlots = document.querySelectorAll('div[id^="slot"]');
    const slots = document.querySelectorAll('div[id^="slot"] > button');
    const slotsPlayers = document.querySelectorAll('div[id^="slot"] > button > img');
    const slotX = document.getElementById("winx");
    const slotO = document.getElementById("wino");
    const draw = document.getElementById("draw");
    let winnerXCount = document.querySelector("div#winx > p.punc-div-score");
    let winnerOCount = document.querySelector("div#wino > p.punc-div-score");
    let drawCount = document.querySelector("div#draw > p.punc-div-score");
    const restartButton = document.getElementById("restartbutton");
    const playerChoosen = document.querySelectorAll('.first-player > div > button');

    for (let i = 0; i < playerChoosen.length; i++) {
        playerChoosen[i].addEventListener("click", () => { startGame(playerChoosen[i].innerHTML) });
    }

    for (let i = 0; i < slots.length; i++) {
        slots[i].addEventListener("click", () => { playerMove(i); });
    }

    restartButton.addEventListener("click", () => { restartGame() });

    function startGame(player) {
        actualPlayer = player == "X";
        actualPlayer = !actualPlayer;
        drawPlayer(slotsPlayers[0]);
        slotsPlayers[0].src = "";
        actualPlayer = !actualPlayer;
        for (let i = 0; i < slots.length; i++) {
            slots[i].removeAttribute("disabled");
        }
        document.getElementsByClassName("first-player")[0].classList.toggle("player-choosen");
    }

    function playerMove(slot) {
        if (slotsPlayers[slot].style.scale != "" || gameEnds) {
            return;
        }
        
        drawPlayer(slotsPlayers[slot]);
        slotsPlayers[slot].style.scale = ".7";

        if (checkWin()) {
            if (actualPlayer) {
                addWins(winnerXCount, slotX, slotO);
            } else {
                addWins(winnerOCount, slotO, slotX);
            }
            return;
        }
        
        if (!checkDraw()) {
            actualPlayer = !actualPlayer;
        }
    }

    function restartGame() {
        if (actualPlayer == null) {
            return;
        }
        
        for (let i = 0; i < slots.length; i++) {
            slotsPlayers[i].style.scale = "";
            slotsPlayers[i].src = "";
            divSlots[i].classList.remove("winnerslot");
            gameEnds = false;
            drawPlayer(slotsPlayers[0]); // Pass a random Slot (This will not affect the game).
            slotsPlayers[0].src = "";
            actualPlayer = !actualPlayer;
        }
    }

    function highlightSlot(slot) {
        slot.style.border = "2px solid #D4CBCB";
        slot.style.boxShadow = "0 0 5px rgba(255, 255, 255, 0.5)";
    }

    function unHighlightSlot(slot) {
        slot.style.border = "0";
        slot.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
    }

    function addWins(winnerCount, slotWinner, slotLoser) {
        winnerCount.innerText++;
        highlightSlot(slotWinner);
        unHighlightSlot(slotLoser);
    }

    function drawPlayer(slot) {
        unHighlightSlot(draw);
        if (actualPlayer) {
            slot.src = "imgs/x-tictactoe.svg";
            highlightSlot(slotO);
            unHighlightSlot(slotX);
        } else {
            slot.src = "imgs/o-tictactoe.svg";
            highlightSlot(slotX);
            unHighlightSlot(slotO);
        }
    }

    function checkWin() {
        gameEnds = true;
        
        for (let i = 0; i < 3; i++) {
            if (slotsPlayers[i * 3].src == slotsPlayers[i * 3 + 1].src && slotsPlayers[i * 3 + 1].src == slotsPlayers[i * 3 + 2].src && slotsPlayers[i * 3 + 2].style.scale != "") {
                slotWinners(divSlots[i * 3], divSlots[i * 3 + 1], divSlots[i * 3 + 2]);
                return true;
            }

            if (slotsPlayers[i].src == slotsPlayers[i + 3].src && slotsPlayers[i + 3].src == slotsPlayers[i + 6].src && slotsPlayers[i + 6].style.scale != "") {
                slotWinners(divSlots[i], divSlots[i + 3], divSlots[i + 6]);
                return true;
            }
        }

        if (slotsPlayers[0].src == slotsPlayers[4].src && slotsPlayers[4].src == slotsPlayers[8].src && slotsPlayers[8].style.scale != "") {
            slotWinners(divSlots[0], divSlots[4], divSlots[8]);
            return true;
        }

        if (slotsPlayers[2].src == slotsPlayers[4].src && slotsPlayers[4].src == slotsPlayers[6].src && slotsPlayers[6].style.scale != "") {
            slotWinners(divSlots[2], divSlots[4], divSlots[6]);
            return true;
        }

        gameEnds = false;
        return false;
    }

    function slotWinners(...winnerSlots) {
        for (let i = 0; i < winnerSlots.length; i++) {
            winnerSlots[i].classList.add("winnerslot");
        }
    }

    function checkDraw() {
        if (!Array.from(slotsPlayers).some(img => img.style.scale == '')) {
            drawCount.innerHTML = parseInt(drawCount.innerHTML) + 1;
            unHighlightSlot(slotX);
            unHighlightSlot(slotO);
            highlightSlot(draw);
            gameEnds = true;
            return true;
        }
        return false;
    }
});