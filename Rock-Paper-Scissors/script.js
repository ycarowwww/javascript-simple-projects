const playerRockButton = document.getElementById("rock");
const playerPaperButton = document.getElementById("paper");
const playerScissorsButton = document.getElementById("scissors");
const playerChoice = document.querySelector(".playerchoice");
const aiChoice = document.querySelector(".aichoice button");
const scoreboard = document.querySelectorAll(".scoreboard > div");
const playerCount = document.getElementById("playercount");
const drawCount = document.getElementById("drawcount");
const aiCount = document.getElementById("aicount");
const playerImage = document.querySelector(".playerchoice img");
const aiImage = document.querySelector(".aichoice img");
let playerMove = null;
let aiMove = null;

playerRockButton.addEventListener("click", () => { playerMoves("rock") });
playerPaperButton.addEventListener("click", () => { playerMoves("paper") });
playerScissorsButton.addEventListener("click", () => { playerMoves("scissors") });

function playerMoves(choice) {
    restartGame();
    playerMove = choice;
    playerImage.src = `images/${playerMove}.svg`;
    aiMoves();
}

function aiMoves() {
    const moves = ["rock", "paper", "scissors"];
    aiMove = moves[Math.floor(Math.random() * 3)];
    aiImage.src = `images/${aiMove}.svg`;
    calculateWinner();
}

function calculateWinner() {
    let count = null;
    if (playerMove === aiMove) {
        count = drawCount;
    } else if (playerMove === "rock") {
        count = aiMove === "paper" ? aiCount : playerCount;
    } else if (playerMove === "paper") {
        count = aiMove === "scissors" ? aiCount : playerCount;
    } else {
        count = aiMove === "rock" ? aiCount : playerCount;
    }
    count.innerHTML++;
    countSlot = document.querySelector(`.scoreboard > div:has(span#${count.id})`)
    winnerCount(countSlot);
}

function winnerCount(count) {
    for (let score of scoreboard) {
        score.classList.remove("winner");
    }
    count.classList.add("winner");
}

function restartGame() {
    playerMove = null;
    aiMove = null;
}