document.addEventListener("DOMContentLoaded", () => {
    const playerRock = document.getElementById("rock");
    const playerPaper = document.getElementById("paper");
    const playerScissors = document.getElementById("scissors");

    const aiRock = document.getElementById("rock-ai");
    const aiPaper = document.getElementById("paper-ai");
    const aiScissors = document.getElementById("scissors-ai");

    const result = document.getElementById("result");

    let playerCount = document.getElementById("playercount");
    let drawCount = document.getElementById("drawcount");
    let aiCount = document.getElementById("aicount");

    let playerMove = null;
    let aiMove = null;
    const moves = ["rock", "paper", "scissors"];

    playerRock.addEventListener("click", () => { playerMoves(playerRock) });
    playerPaper.addEventListener("click", () => { playerMoves(playerPaper) });
    playerScissors.addEventListener("click", () => { playerMoves(playerScissors) });

    function playerMoves(playerButton) {
        restartGame();
        playerMove = playerButton.innerHTML.toLowerCase();
        console.log(playerMove);
        playerButton.style.backgroundColor = "green";
        aiMoves();
    }

    function aiMoves() {
        aiMove = moves[Math.floor(Math.random() * 3)];
        console.log(aiMove);
        if (aiMove == "rock") {
            aiRock.style.backgroundColor = "red";
        } else if (aiMove == "paper") {
            aiPaper.style.backgroundColor = "red";
        } else {
            aiScissors.style.backgroundColor = "red";
        }
        calculateWinner();
    }

    function calculateWinner() {
        if (playerMove == "rock") {
            if (aiMove == "paper") {
                result.innerHTML = "Result: Lost";
                aiCount.innerHTML++;
            } else if (aiMove == "scissors") {
                result.innerHTML = "Result: Wins";
                playerCount.innerHTML++;
            } else {
                result.innerHTML = "Result: Draw";
                drawCount.innerHTML++;
            }
        } else if (playerMove == "paper") {
            if (aiMove == "scissors") {
                result.innerHTML = "Result: Lost";
                aiCount.innerHTML++;
            } else if (aiMove == "rock") {
                result.innerHTML = "Result: Wins";
                playerCount.innerHTML++;
            } else {
                result.innerHTML = "Result: Draw";
                drawCount.innerHTML++;
            }
        } else {
            if (aiMove == "rock") {
                result.innerHTML = "Result: Lost";
                aiCount.innerHTML++;
            } else if (aiMove == "paper") {
                result.innerHTML = "Result: Wins";
                playerCount.innerHTML++;
            } else {
                result.innerHTML = "Result: Draw";
                drawCount.innerHTML++;
            }
        }
    }

    function restartGame() {
        playerMove = null;
        aiMove = null;
        playerRock.style.backgroundColor = "lightgray";
        playerPaper.style.backgroundColor = "lightgray";
        playerScissors.style.backgroundColor = "lightgray";
        aiRock.style.backgroundColor = "lightgray";
        aiPaper.style.backgroundColor = "lightgray";
        aiScissors.style.backgroundColor = "lightgray";
        result.innerHTML = "Result: ";
    }
});