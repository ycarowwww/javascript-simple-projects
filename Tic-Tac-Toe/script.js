let actualPlayer = null; // true -> X | false -> O | null -> any
let gameEnds = false;
const firstPlayer = document.querySelector(".first-player");
const firstPlayersButtons = document.querySelectorAll(".first-player > button");
const punctuationSlots = document.querySelectorAll(".punctuation > div");
const punctuationScore = document.querySelectorAll(".punctuation > div > .punc-div-score");
const boardSlots = document.querySelectorAll(".board > div > button");
const boardSlotsImages = document.querySelectorAll(".board > div > button > img");
let winnerBoardSlots = [];
const restartButton = document.getElementById("restartbutton");
const resetButton = document.getElementById("resetbutton");

for (let player of firstPlayersButtons) player.addEventListener("click", () => { startGame(player.innerHTML) });
for (let slot of boardSlots) slot.addEventListener("click", () => { playerMove(Array.from(boardSlots).indexOf(slot)) });
restartButton.addEventListener("click", restartGame);
resetButton.addEventListener("click", resetGame);

function startGame(player) {
    actualPlayer = player === "X"; // true -> X | false -> O | null -> any
    firstPlayer.classList.toggle("player-choosen");
    for (slot of boardSlots) slot.removeAttribute("disabled");
    highlightPunctuationSlot(actualPlayer ? 0 : 2);
}

function playerMove(boardSlotId) {
    if (boardSlotsImages[boardSlotId].style.scale != "" || gameEnds) return;

    boardSlotsImages[boardSlotId].src = actualPlayer ? "imgs/x-tictactoe.svg" : "imgs/o-tictactoe.svg";
    boardSlotsImages[boardSlotId].style.scale = ".7";
    
    if (checkWin()) {
        for (slot of winnerBoardSlots) slot.classList.add("winnerslot");
        for (slot of boardSlots) slot.setAttribute("disabled", "");
        punctuationScore[actualPlayer ? 0 : 2].innerHTML++;
    } else if (checkDraw()) {
        highlightPunctuationSlot(1);
        punctuationScore[1].innerHTML++;
        for (slot of boardSlots) slot.setAttribute("disabled", "");
    } else {
        actualPlayer = !actualPlayer;
        highlightPunctuationSlot(actualPlayer ? 0 : 2);
    }
}

function checkWin() {
    gameEnds = true;
    
    for (let i = 0; i < 3; i++) {
        if (boardSlotsImages[i * 3].src == boardSlotsImages[i * 3 + 1].src && boardSlotsImages[i * 3 + 1].src == boardSlotsImages[i * 3 + 2].src && boardSlotsImages[i * 3 + 2].style.scale != "") {
            winnerBoardSlots = [boardSlots[i * 3], boardSlots[i * 3 + 1], boardSlots[i * 3 + 2]];
            return true;
        }

        if (boardSlotsImages[i].src == boardSlotsImages[i + 3].src && boardSlotsImages[i + 3].src == boardSlotsImages[i + 6].src && boardSlotsImages[i + 6].style.scale != "") {
            winnerBoardSlots = [boardSlots[i], boardSlots[i + 3], boardSlots[i + 6]];
            return true;
        }
    }

    if (boardSlotsImages[0].src == boardSlotsImages[4].src && boardSlotsImages[4].src == boardSlotsImages[8].src && boardSlotsImages[8].style.scale != "") {
        winnerBoardSlots = [boardSlots[0], boardSlots[4], boardSlots[8]];
        return true;
    }

    if (boardSlotsImages[2].src == boardSlotsImages[4].src && boardSlotsImages[4].src == boardSlotsImages[6].src && boardSlotsImages[6].style.scale != "") {
        winnerBoardSlots = [boardSlots[2], boardSlots[4], boardSlots[6]];
        return true;
    }

    gameEnds = false;
    return false;
}

function checkDraw() {
    return !Array.from(boardSlotsImages).some(img => img.style.scale === "")
}

function restartGame() {
    if (actualPlayer === null) return;

    for (slot of boardSlotsImages) {
        slot.style.scale = "";
        slot.src = "";
    }
    for (slot of winnerBoardSlots) slot.classList.remove("winnerslot");
    for (slot of boardSlots) slot.removeAttribute("disabled");
    winnerBoardSlots = [];
    actualPlayer = !actualPlayer;
    highlightPunctuationSlot(actualPlayer ? 0 : 2);
    gameEnds = false;
}

function resetGame() {
    if (actualPlayer === null) return;

    actualPlayer = null;
    highlightPunctuationSlot(3);
    for (slot of boardSlotsImages) {
        slot.style.scale = "";
        slot.src = "";
    }
    for (slot of winnerBoardSlots) slot.classList.remove("winnerslot");
    for (slot of boardSlots) slot.setAttribute("disabled", "");
    for (punctuation of punctuationScore) punctuation.innerHTML = 0;
    firstPlayer.classList.toggle("player-choosen");
    winnerBoardSlots = [];
    gameEnds = false;
}

function highlightPunctuationSlot(slotToHighlight) { // 0 -> X Player | 1 -> Draw | 2 -> O Player | 3 -> None
    for (slot of punctuationSlots) slot.classList.remove("highlighted");
    if (slotToHighlight !== 3) punctuationSlots[slotToHighlight].classList.toggle("highlighted");
}