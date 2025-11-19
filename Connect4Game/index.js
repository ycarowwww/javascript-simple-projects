class Game {
    constructor(rows, columns, lineSize, initialTeam = 0) {
        if (rows < lineSize && columns < lineSize) throw "Impossible to Win in this game.";
        
        this.rows = rows;
        this.columns = columns;
        this.lineSize = lineSize;
        this.reset(initialTeam);
    }

    reset(initialTeam = 0) {
        if (initialTeam !== 1 && initialTeam !== 2) this.currentTeam = Math.floor(Math.random() * 2) + 1; // "1" or "2".
        else this.currentTeam = initialTeam;
        this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
        this.ended = false;
        this.winnerLine = [];
    }

    addPiece(columnIndex) {
        if (this.ended) return;
        if (columnIndex < 0 || columnIndex >= this.columns) throw "Invalid Column Index";

        const rowIndex = this.board.map(row => row[columnIndex]).lastIndexOf(0);

        if (rowIndex < 0) return;

        this.board[rowIndex][columnIndex] = this.currentTeam;
        
        if (this.checkWinner()) {
            this.ended = true;
            return;
        } else {
            this.changeTeam();
        }
    }

    changeTeam() {
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;
    }

    checkWinner() {
        const board = this.board;
        const rows = this.rows;
        const columns = this.columns;
        const lineSize = this.lineSize;
        
        function checkDirection(r, c, dr, dc) {
            const player = board[r][c];
            if (player === 0) return false; // Empty Space.

            for (let i = 1; i < lineSize; i++) {
                const nr = r + dr * i; // dr/dc are between -1 and 1.
                const nc = c + dc * i;
                if (nr < 0 || nc < 0 || nr >= rows || nc >= columns || board[nr][nc] !== player) {
                    return false; // Invalid Position or Different Player.
                }
            }

            return true;
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (c + lineSize <= columns && checkDirection(r, c, 0, 1)) {
                    this.winnerLine = Array.from({ length: this.lineSize }, (v, k) => [ r, c + k ]);
                    return true; // Found a Horizontal win.
                }

                if (r + lineSize <= rows && checkDirection(r, c, 1, 0)) {
                    this.winnerLine = Array.from({ length: this.lineSize }, (v, k) => [ r + k, c ]);
                    return true; // Found a Vertical win.
                }

                if (r + lineSize <= rows && c + lineSize <= columns && checkDirection(r, c, 1, 1)) {
                    this.winnerLine = Array.from({ length: this.lineSize }, (v, k) => [ r + k, c + k ]);
                    return true; // Found a Diagonal win (down-right).
                }
                
                if (r - lineSize >= -1 && c + lineSize <= columns && checkDirection(r, c, -1, 1)) {
                    this.winnerLine = Array.from({ length: this.lineSize }, (v, k) => [ r - k, c + k ]);
                    return true; // Found a Diagonal win (up-right).
                }
            }
        }

        return false; // No winner found.
    }

    updateHTML(mainElement, inputPlayerColors) {
        const btnBoard = [];
        mainElement.querySelectorAll(".row").forEach(rowElement => { // Creates a matrice with the HTML buttons elements.
            btnBoard.push(Array.from(rowElement.querySelectorAll("button")));
        });

        for (let i = 0; i < this.rows; i++) { // Puts the correct classes in the HTML buttons.
            for (let j = 0; j < this.columns; j++) {
                btnBoard[i][j].className = "";
                
                if (this.board[i][j] === 1) btnBoard[i][j].classList.add("btn-team-1");
                else if (this.board[i][j] === 2) btnBoard[i][j].classList.add("btn-team-2");

                if (this.winnerLine.some(pos => pos.every((val, ind) => val === [i, j][ind]))) btnBoard[i][j].classList.add("winner"); // Basically a "this.winnerLine.includes([i, j])", but that works.
            }
        }

        inputPlayerColors.forEach(inputColor => { // Identifies the current team playing.
            inputColor.className = "";
        });
        if (this.currentTeam !== 0) inputPlayerColors[this.currentTeam - 1].classList.add("current-team");
    }
}

const root = document.documentElement;
const main = document.getElementById("game");
const inputAmountRows = document.getElementById("amount-rows");
const inputAmountColumns = document.getElementById("amount-columns");
const inputLineSize = document.getElementById("linesize");
const inputPlayerColors = document.querySelectorAll('.player-settings input[type="color"]');
const btnCreateBoard = document.getElementById("create-board");
const btnResetBoard = document.getElementById("reset-board");
let game = createBoard(main, inputPlayerColors, Number(inputAmountRows.value), Number(inputAmountColumns.value), Number(inputLineSize.value));

main.addEventListener("click", e => {
    const btnPressed = e.target.closest("button");
    
    if (!btnPressed) return; // Any button pressed.

    const columnIndex = Array.from(btnPressed.parentElement.querySelectorAll("button")).indexOf(btnPressed);
    game.addPiece(columnIndex);
    
    game.updateHTML(main, inputPlayerColors);
});

btnCreateBoard.addEventListener("click", () => {
    game = createBoard(main, inputPlayerColors, Number(inputAmountRows.value), Number(inputAmountColumns.value), Number(inputLineSize.value));
});

btnResetBoard.addEventListener("click", () => {
    game.reset();
    game.updateHTML(main, inputPlayerColors);
});

for (let i = 0; i < inputPlayerColors.length; i++) {
    inputPlayerColors[i].addEventListener("input", () => {
        setPlayerColor(root, `--team-${i+1}-color`, inputPlayerColors[i].value);
    });
}

function createBoard(mainElement, inputPlayerColors, rows, columns, lineSize) {
    const newGame = new Game(rows, columns, lineSize);
    
    while (mainElement.firstChild) {
        mainElement.removeChild(mainElement.lastChild);
    }

    for (let i = 0; i < rows; i++) {
        const newRow = document.createElement("div");
        newRow.classList.add("row");

        for (let j = 0; j < columns; j++) {
            const newBtn = document.createElement("button");
            newRow.appendChild(newBtn);
        }

        mainElement.appendChild(newRow);
    }

    newGame.updateHTML(mainElement, inputPlayerColors);

    return newGame;
}

function setPlayerColor(rootElement, colorProperty, newColor) {
    rootElement.style.setProperty(colorProperty, newColor);
}
