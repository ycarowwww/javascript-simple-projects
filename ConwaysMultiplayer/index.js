class ConwaysGame {
    constructor(canvas, boardColors, populationCounter) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.rectSize = 30;
        this.canvasOffset = [ 0, 0 ];
        this.isGridMoving = false;
        this.liveSquares = [ new Set() ];
        this.playerColors = [ "#FFFF00" ];
        this.selectedTeamIndex = 0;
        this.boardColors = boardColors;
        this.interval = null;
        this.counter = populationCounter;
    }

    getLiveNeighbours(liveCells, pos) {
        const liveNeighbours = Array.from({ length : liveCells.length }, () => 0);

        for (let i = 0; i < liveCells.length; i++) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue;
                    if (liveCells[i].has([ pos[0] + dx, pos[1] + dy ].join(","))) {
                        liveNeighbours[i] += 1;
                    }
                }
            }
        }

        let maxPlayer = 0;
        let maxNeighbours = liveNeighbours[maxPlayer];
        let anotherTeamSameAmount = false;

        for (let i = 1; i < liveNeighbours.length; i++) {
            if (liveNeighbours[i] > maxNeighbours) {
                maxPlayer = i;
                maxNeighbours = liveNeighbours[i];
                anotherTeamSameAmount = false;
            } else if (liveNeighbours[i] === maxNeighbours) {
                anotherTeamSameAmount = true;
            }
        }

        if (anotherTeamSameAmount || maxNeighbours <= 0) {
            return [ 0, -1 ];
        } else {
            return [ maxNeighbours, maxPlayer ];
        }
    }

    updateBoard(liveCells) {
        const newCells = Array.from({ length : liveCells.length }, () => new Set());
        const candidates = new Set();
        const liveCandidates = new Set();

        for (const cells of liveCells) {
            for (const pos of cells) {
                const numberPos = pos.split(",").map(v => Number(v));
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const candPos = [ numberPos[0] + dx, numberPos[1] + dy ];
                        const candPosText = candPos.join(",");
                        if (dx === 0 && dy === 0) liveCandidates.add(candPosText);
                        candidates.add(candPosText);
                    }
                }
            }
        }
        
        for (const pos of candidates) {
            const posList = pos.split(",").map(v => Number(v));
            const [liveNeighbours, playerIndex] = this.getLiveNeighbours(liveCells, posList);

            if (liveCandidates.has(pos)) {
                if (2 <= liveNeighbours && liveNeighbours <= 3) {
                    newCells[playerIndex].add(pos);
                }
            } else {
                if (liveNeighbours === 3) {
                    newCells[playerIndex].add(pos);
                }
            }
        }

        return newCells;
    }

    drawGrid() {
        this.drawRect(0, 0, this.canvas.width, this.canvas.height, this.boardColors["background"]);
    
        const pos1 = this.pickPositionIndex([ 0, 0 ]);
        const pos2 = this.pickPositionIndex([ this.canvas.width, this.canvas.height ]);
        
        const amountColumns = pos2[0] - pos1[0] + 1;
        const amountRows = pos2[1] - pos1[1] + 1;
        
        for (let i = 0; i < amountRows; i++) {
            for (let j = 0; j < amountColumns; j++) {
                const rectIndexes = [ pos1[0] + j, pos1[1] + i ];
                const rectPos = [
                    this.rectSize * rectIndexes[0] + this.canvasOffset[0],
                    this.rectSize * rectIndexes[1] + this.canvasOffset[1]
                ];
    
                let squareDrawn = false;
                const rectIndStr = rectIndexes.join(",");
                for (let team = 0; team < this.liveSquares.length; team++) {
                    if (this.liveSquares[team].has(rectIndStr)) {
                        this.drawRect(rectPos[0], rectPos[1], this.rectSize, this.rectSize, this.playerColors[team]);
                        squareDrawn = true;
                        break;
                    }
                }
                if (!squareDrawn) {
                    this.drawRect(rectPos[0], rectPos[1], this.rectSize, this.rectSize, this.boardColors["border"], this.boardColors["background"], this.rectSize / 20);
                }
            }
        }
    }

    drawRect(x, y, width, height, foregroundColor, backgroundColor="", borderSize=0) {
        this.ctx.fillStyle = foregroundColor;
        this.ctx.fillRect(x, y, width, height);
    
        if (borderSize !== 0 && borderSize * 2 <= width && borderSize * 2 <= height) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(x + borderSize, y + borderSize, width - borderSize * 2, height - borderSize * 2);
        }
    }

    pickPositionIndex(pos) {
        const posX = pos[0] - this.canvasOffset[0];
        const posY = pos[1] - this.canvasOffset[1];
    
        return [ Math.floor(posX / this.rectSize), Math.floor(posY / this.rectSize) ];
    }

    setGridMoving(isMoving) {
        this.isGridMoving = isMoving;
    }

    dislocateGrid(event) {
        if (event.buttons !== 1 || !this.isGridMoving) return;
        
        this.canvasOffset[0] += event.movementX;
        this.canvasOffset[1] += event.movementY;

        this.drawGrid();
    }

    updatePosition(event, isToggleBtnChecked) {
        if (!isToggleBtnChecked || this.interval !== null) return; // inputSet
        
        const posX = event.clientX - gameCanvas.offsetLeft;
        const posY = event.clientY - gameCanvas.offsetTop;
    
        const indexes = this.pickPositionIndex([ posX, posY ]);
        const posText = indexes.join(",");
        if (this.liveSquares[this.selectedTeamIndex].has(posText)) {
            this.liveSquares[this.selectedTeamIndex].delete(posText);
        } else {
            for (let i = 0; i < this.liveSquares.length; i++) {
                if (i !== this.selectedTeamIndex && this.liveSquares[i].has(posText)) {
                    this.liveSquares[i].delete(posText);
                    break;
                }
            }

            this.liveSquares[this.selectedTeamIndex].add(posText);
        }
    
        this.drawGrid();
        this.updateCounter();
    }
    
    zoomCanvas(event, isToggleBtnChecked) {
        if (!isToggleBtnChecked) return; // inputZoom
        
        const zoomFactor = event.deltaY > 0 ? -1 : 1
        const oldRectSize = this.rectSize;
        
        this.rectSize += zoomFactor;
        this.rectSize = Math.min(100, Math.max(5, this.rectSize));
        const scale = this.rectSize / oldRectSize;
    
        const mouseX = event.clientX - this.canvas.offsetLeft;
        const mouseY = event.clientY - this.canvas.offsetTop;
    
        this.canvasOffset[0] = mouseX - (mouseX - this.canvasOffset[0]) * scale;
        this.canvasOffset[1] = mouseY - (mouseY - this.canvasOffset[1]) * scale;
    
        this.drawGrid();
    }
    
    resizeCanvas(newWidth, newHeight) {
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.drawGrid();
    }

    toggleGameSituation() {
        if (this.interval === null) {
            this.interval = setInterval(() => {
                this.liveSquares = this.updateBoard(this.liveSquares);
                this.drawGrid();
                this.updateCounter();
            }, 200);
        } else {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    updateCounter() {
        const currentPopulation = this.liveSquares.map(v => v.size).join(" ");
        this.counter.textContent = `Population: ${currentPopulation}`;
    }

    addNewTeam(color) {
        this.liveSquares.push(new Set());
        this.playerColors.push(color);
        this.updateCounter();
    }

    removeTeam(index) {
        this.liveSquares.splice(index, 1);
        this.playerColors.splice(index, 1);
        this.selectedTeamIndex = Math.min(this.selectedTeamIndex, this.liveSquares.length-1);
        this.drawGrid();
        this.updateCounter();
    }

    changeTeamColor(index, newColor) {
        this.playerColors[index] = newColor;
        this.drawGrid();
    }

    resetTeams() {
        if (this.interval !== null) return;
        
        this.liveSquares.forEach(setSquares => setSquares.clear());
        this.drawGrid();
        this.updateCounter();
    }
}

const screenDiv = document.getElementById("screen");
const populationCounter = document.getElementById("population");
const gameContainer = document.getElementById("canvas-container");
const gameCanvas = document.getElementById("game-canvas");
const boardColors = {
    "background" : "#191920",
    "border" : "#414142"
};
const conwaysGame = new ConwaysGame(gameCanvas, boardColors, populationCounter);
const toggleVisibility = document.getElementById("btn-toggle-visibility");
const toggleVisibilityImg = document.getElementById("btn-toggle-visibility__img");
let isMenuVisible = false;
const inputMovement = document.getElementById("input-movement");
const inputZoom = document.getElementById("input-zoom");
const inputSet = document.getElementById("input-set");
const startGameBtn = document.getElementById("start-game");
const stopGameBtn = document.getElementById("stop-game");
const teamsList = document.getElementById("teams-list");
const teamElementTemplate = document.getElementById("team-element-template");
const addTeamsBtn = document.getElementById("add-teams");
const resetTeamsBtn = document.getElementById("reset-teams");

function swapVisibilityImg() {
    let img;
    if (isMenuVisible) img = "opened.svg";
    else img = "closed.svg";
    toggleVisibilityImg.setAttribute("src", `./images/${img}`);
    isMenuVisible = !isMenuVisible;
    screenDiv.classList.toggle("closed", isMenuVisible);
}

function calculateSizeCanvas(entries) {
    let newWidth;
    for (const entry of entries) {
        newWidth = entry.borderBoxSize[0].inlineSize;
    }
    const newHeight = Math.min(gameContainer.offsetHeight, window.innerHeight);

    conwaysGame.resizeCanvas(newWidth, newHeight);
}

function generateRandomColor() {
    const colorText = "0123456789ABCDEF";
    const color = [];
    for (let i = 0; i < 6; i++) {
        color.push(colorText[Math.floor(Math.random() * colorText.length)]);
    }
    return color.join("");
}

function addNewTeam() {
    const newTeamElement = teamElementTemplate.content.cloneNode(true);
    
    const teamName = newTeamElement.querySelector(".team-name");
    teamName.value = `Team ${teamsList.children.length + 1}`;
    const teamColor = newTeamElement.querySelector(".team-color");
    teamColor.value = generateRandomColor();
    const teamColorSquare = newTeamElement.querySelector(".team-color-square");
    teamColorSquare.style.backgroundColor = `#${teamColor.value}`;
    
    teamsList.appendChild(newTeamElement);
    conwaysGame.addNewTeam(`#${teamColor.value}`);
}

function changeSquareColor(teamElement, inputColor) {
    const regexCheckHexCode = /^[0-9A-Fa-f]{6}$/g;
    const inputColorValue = inputColor.value;
    
    if (regexCheckHexCode.test(inputColorValue)) {
        const teamElementSquare = teamElement.querySelector(".team-color-square");
        teamElementSquare.style.backgroundColor = `#${inputColorValue}`;

        const teamIndex = Array.from(teamsList.children).indexOf(teamElement);
        conwaysGame.changeTeamColor(teamIndex, `#${inputColorValue}`);
    }
}

function setSelectedTeam() {
    if (document.querySelector(".selected-to-set") === null) {
        teamsList.children[conwaysGame.selectedTeamIndex].classList.add("selected-to-set");
    }
}

new ResizeObserver(calculateSizeCanvas).observe(gameContainer);
toggleVisibility.addEventListener("click", swapVisibilityImg);
conwaysGame.canvas.addEventListener("mousedown", e => {
    if (e.button === 0 && inputMovement.checked) conwaysGame.setGridMoving(true);
});
document.addEventListener("mouseup", () => conwaysGame.setGridMoving(false));
document.addEventListener("mousemove", e => conwaysGame.dislocateGrid(e));
conwaysGame.canvas.addEventListener("wheel", e => conwaysGame.zoomCanvas(e, inputZoom.checked));
conwaysGame.canvas.addEventListener("click", e => conwaysGame.updatePosition(e, inputSet.checked));
inputMovement.addEventListener("change", () => {
    if (inputMovement.checked) inputSet.checked = false;
});
inputSet.addEventListener("change", () => {
    if (conwaysGame.interval !== null) inputSet.checked = false;
    else if (inputSet.checked) inputMovement.checked = false;

    setSelectedTeam();
});
startGameBtn.addEventListener("click", () => {
    startGameBtn.disabled = true;
    stopGameBtn.disabled = false;
    inputSet.checked = false;
    conwaysGame.toggleGameSituation();
});
stopGameBtn.addEventListener("click", () => {
    startGameBtn.disabled = false;
    stopGameBtn.disabled = true;
    conwaysGame.toggleGameSituation();
});
addTeamsBtn.addEventListener("click", addNewTeam);
teamsList.addEventListener("click", e => {
    const teamIndex = Array.from(teamsList.children).indexOf(e.target.closest("li"));

    if (e.target.closest("button") !== null && teamsList.children.length > 1) {
        conwaysGame.removeTeam(teamIndex);
        e.target.closest("li").remove();
        setSelectedTeam();
    } else if (e.target.closest(".team-color-square") !== null) {
        teamsList.children[conwaysGame.selectedTeamIndex].classList.remove("selected-to-set");
        const teamElement = e.target.closest("li");
        teamElement.classList.add("selected-to-set");
        conwaysGame.selectedTeamIndex = teamIndex;
    }
});
teamsList.addEventListener("input", e => {
    const closestInputColor = e.target.closest(".team-color");
    
    if (closestInputColor !== null) {
        const teamElement = e.target.closest("li");
        changeSquareColor(teamElement, closestInputColor);
    }
});
resetTeamsBtn.addEventListener("click", () => conwaysGame.resetTeams());
