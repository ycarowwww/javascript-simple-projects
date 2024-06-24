document.addEventListener("DOMContentLoaded", () => {
    const playerRock = document.getElementById("rock");
    const playerPaper = document.getElementById("paper");
    const playerScissors = document.getElementById("scissors");

    let playerChoice = document.querySelector(".playerchoice button");
    let aiChoice = document.querySelector(".aichoice button");

    let playerCount = document.getElementById("playercount");
    let drawCount = document.getElementById("drawcount");
    let aiCount = document.getElementById("aicount");

    let playerMove = null;
    let aiMove = null;
    const moves = ["rock", "paper", "scissors"];
    let movesImages = new Map();
    movesImages.set("rock", "&#x1F48E;");
    movesImages.set("paper", "&#x1F4DC;");
    movesImages.set("scissors", "&#x2702;");

    playerRock.addEventListener("click", () => { playerMoves(playerRock) });
    playerPaper.addEventListener("click", () => { playerMoves(playerPaper) });
    playerScissors.addEventListener("click", () => { playerMoves(playerScissors) });

    function playerMoves(playerButton) {
        restartGame();
        playerMove = playerButton.id;
        playerChoice.innerHTML = playerButton.innerHTML;
        aiMoves();
    }

    function aiMoves() {
        aiMove = moves[Math.floor(Math.random() * 3)];
        aiChoice.innerHTML = movesImages.get(aiMove);
        calculateWinner();
    }

    function calculateWinner() {
        if (playerMove == "rock") {
            if (aiMove == "paper") {
                aiCount.innerHTML++;
            } else if (aiMove == "scissors") {
                playerCount.innerHTML++;
            } else {
                drawCount.innerHTML++;
            }
        } else if (playerMove == "paper") {
            if (aiMove == "scissors") {
                aiCount.innerHTML++;
            } else if (aiMove == "rock") {
                playerCount.innerHTML++;
            } else {
                drawCount.innerHTML++;
            }
        } else {
            if (aiMove == "rock") {
                aiCount.innerHTML++;
            } else if (aiMove == "paper") {
                playerCount.innerHTML++;
            } else {
                drawCount.innerHTML++;
            }
        }
    }

    function restartGame() {
        playerMove = null;
        aiMove = null;
    }
});