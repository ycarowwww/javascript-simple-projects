class CanvasManager {
    #ctx;
    // Class with the CTX functions.
    constructor(ctx) {
        this.#ctx = ctx;
    }

    get width() {
        return this.#ctx.canvas.width;
    }

    get height() {
        return this.#ctx.canvas.height;
    }

    drawCircle(x, y, radius, { fill = null, stroke = null, lineWidth = 0 } = {}) {
        this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);

        if (fill) {
            this.#ctx.fillStyle = fill;
            this.#ctx.fill();
        } else if (stroke) {
            this.#ctx.strokeStyle = stroke;
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.stroke();
        }

        this.#ctx.closePath();
        this.#ctx.restore();
    }

    drawInwardStrokeCircle(x, y, radius, lineWidth, color) {
        this.#ctx.save();
        // Instead of a line that grows inwards and outwards of the circle, this will only draw a stroke that grows inwards.
        // Basically, just draws a "normal" CTX stroke circle but with the radius reduced by half of the stroke width.

        lineWidth = Math.min(radius, lineWidth);
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, radius - lineWidth / 2, 0, 2 * Math.PI);
        this.#ctx.lineWidth = lineWidth;
        this.#ctx.strokeStyle = color;
        this.#ctx.stroke();
        this.#ctx.closePath();

        this.#ctx.restore();
    }

    drawRect(x, y, width, height, { fill = null, stroke = null, lineWidth = 0 } = {}, alpha = 1.0) {
        this.#ctx.save();
        
        this.#ctx.globalAlpha = alpha;
        if (fill) {
            this.#ctx.fillStyle = fill;
            this.#ctx.fillRect(x, y, width, height);
        } else if (stroke) {
            this.#ctx.strokeStyle = stroke;
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.strokeRect(x, y, width, height);
        }

        this.#ctx.restore();
    }

    drawRoundRect(x, y, width, height, radii, { fill = null, stroke = null, lineWidth = 0 } = {}) {
        // Rectangle with rounded borders
        this.#ctx.save();
        this.#ctx.beginPath();
        this.#ctx.roundRect(x, y, width, height, radii);
        
        if (fill) {
            this.#ctx.fillStyle = fill;
            this.#ctx.fill();
        } else if (stroke) {
            this.#ctx.strokeStyle = stroke;
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.stroke();
        }

        this.#ctx.closePath();
        this.#ctx.restore();
    }

    drawBorderedRoundRect(x, y, width, height, lineWidth, radii, borderColor, fill) {
        // Rect with inwards stroke and different colors for the inside and outside.
        this.drawRoundRect(x, y, width, height, radii, { fill: borderColor });
        this.drawRoundRect(x + lineWidth, y + lineWidth, width - 2 * lineWidth, height - 2 * lineWidth, radii, { fill: fill });
    }

    drawText(x, y, text, font, fontSize, { fill = null, stroke = null, lineWidth = 0 } = {}, { textAlign = "start", textBaseline = "top", weight = "normal" } = {}) {
        this.#ctx.save();
        
        this.#ctx.font = `${weight} ${fontSize} ${font}`;
        this.#ctx.textAlign = textAlign;
        this.#ctx.textBaseline = textBaseline;
        if (fill) {
            this.#ctx.fillStyle = fill;
            this.#ctx.fillText(text, x, y);
        } else if (stroke) {
            this.#ctx.strokeStyle = stroke;
            this.#ctx.lineWidth = lineWidth;
            this.#ctx.strokeText(text, x, y);
        }

        this.#ctx.restore();
    }

    getTextMetrics(text, font, fontSize, fontWeight) {
        // Return and measure the metrics of the text when it drawed on the Canvas.
        this.#ctx.save();

        this.#ctx.font = `${fontWeight} ${fontSize} ${font}`;
        const measures = this.#ctx.measureText(text);
        
        this.#ctx.restore();

        return measures;
    }

    resize(newWidth, newHeight) {
        this.#ctx.canvas.width = newWidth;
        this.#ctx.canvas.height = newHeight;
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    }
}

const GameState = Object.freeze({ // "Enum" containing the possible game states.
    START: 0,
    RUNNING: 1,
    PAUSED: 2,
    GAMEOVER: 3
});
const baseScreenSize = [ 1000, 600 ]; // Canvas is originally created as 1000x600 and then it's resized appropriately.

class Game {
    #canvas;
    constructor(ctx, width, height) {
        this.#canvas = new CanvasManager(ctx);
        this.#canvas.resize(width, height);

        this.lastTime = 0; // LastTime for DeltaTime calculation.
        this.keysPressed = new Set();
        this.mousePressed = new Set();
        this.currMousePos = { x: 0, y: 0 }; // Actual Mouse Position.
        // Colors Declaration
        const [mainForegroundColor, mainBackgroundColor] = [ "white", "#1d1a1e" ];
        const obstacleColors = [ "#c60a11", "#e9b416", "#0abf3d", "#0775be" ];
        const obstacleBorderColors = [ "#950a0f", "#b0870e", "#0b8b2f", "#0a5b91" ];
        // Game Objects Declation
        this.player = new Player(width / 2, height - 30, 200, 20, baseScreenSize[0] / 2, mainForegroundColor);
        this.ball = new Ball(300, 615, 15, baseScreenSize[0] / 2, mainForegroundColor);
        this.obstacleManager = new ObstacleManager(this.#canvas.width, this.#canvas.height, 7, 35, obstacleColors, obstacleBorderColors, 5, 100, 4);
        this.lifeCounter = new LifeCounter(0, 0, 15, 3, 15, mainForegroundColor);
        this.scoreCounter = new ScoreCounter(width / 2, 15, mainForegroundColor);
        this.menu = new Menu(width / 2, height / 2, mainForegroundColor, mainBackgroundColor);
        this.pauseButton = new PauseButton(width - 40, 40, 30, 30, mainForegroundColor);
        this.state = GameState.START; // Current Game State
    }

    loop(timeStamp) { // Game Loop
        const dt = (timeStamp - this.lastTime) / 1000; // Deltatime Calculation.
        this.lastTime = timeStamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this)); // "Real" Loop.
    }

    update(dt) {
        const gameConstants = this.gameConstants; // Variable containing Mouse Position, Keys Pressed, etc.
        gameConstants["dt"] = dt;

        switch (this.state) {
            case GameState.START:
                this.player.updateWithEvents(gameConstants);
                this.ball.setSpawnPosition(this.player); // Balls stays above the player
                if (this.ball.checkLaunch(gameConstants)) { // Player starts the game
                    this.state = GameState.RUNNING;
                }

                this.pauseButton.updateWithEvents(gameConstants); // Check if the player paused the game.
                if (this.pauseButton.paused) {
                    this.pauseButton.setPreviousGameState(this.state);
                    this.state = GameState.PAUSED;
                    this.menu.setTexts(this.#canvas, "Game Paused", "Continue");
                    this.menu.setScores(this.scoreCounter.score, this.scoreCounter.highScore);
                }
                break;
            
            case GameState.RUNNING:
                this.player.updateWithEvents(gameConstants); // Updates GameObjects.
                this.obstacleManager.checkCollisionWithBall(this.ball, this.scoreCounter.increaseScore.bind(this.scoreCounter, 10));
                this.ball.updateWithEvents(gameConstants);
                this.ball.checkCollisionWithPlayer(this.player);
                this.ball.update(dt);
                this.obstacleManager.checkObstaclesState(this.ball.multiplySpeed.bind(this.ball, 1.1));
                this.pauseButton.updateWithEvents(gameConstants);
                if (this.pauseButton.paused) { // Check if the player paused the game.
                    this.pauseButton.setPreviousGameState(this.state);
                    this.state = GameState.PAUSED;
                    this.menu.setTexts(this.#canvas, "Game Paused", "Continue");
                    this.menu.setScores(this.scoreCounter.score, this.scoreCounter.highScore);
                }

                if (this.ball.leftTheGame) { // Checks if the ball "fell".
                    this.lifeCounter.decreaseRemainingLifes();
                    this.ball.leftTheGame = false;
                    if (this.lifeCounter.remainingLifes < 0) { // If all the lifes have been used up, ends the game.
                        this.menu.setTexts(this.#canvas, "End of Game", "Play Again");
                        this.menu.setScores(this.scoreCounter.score, this.scoreCounter.highScore);
                        this.state = GameState.GAMEOVER;
                    } else { // Else, returns to the beginning of the game.
                        this.state = GameState.START;
                    }
                }
                break;
        
            case GameState.PAUSED:
                this.menu.updateWithEvents(gameConstants);

                if (this.menu.buttonPressed) { // If the "return to the game" button was pressed, continues the game.
                    this.state = this.pauseButton.getPreviousGameState();
                }
                break;
                
            case GameState.GAMEOVER:
                this.menu.updateWithEvents(gameConstants);

                if (this.menu.buttonPressed) { // If the "restart game" button was pressed, restarts the game.
                    this.lifeCounter.resetRemainingLifes();
                    this.obstacleManager.resetObstacles();
                    this.scoreCounter.resetScore();
                    this.ball.resetSpeed();
                    this.state = GameState.START;
                }
                break;
                
            default:
                break;
        }
    }

    draw() {
        this.#canvas.clear(); // Clears the screen.
        
        this.player.draw(this.#canvas);
        this.ball.draw(this.#canvas);
        this.obstacleManager.draw(this.#canvas);
        this.lifeCounter.draw(this.#canvas);
        this.scoreCounter.draw(this.#canvas);
        this.pauseButton.draw(this.#canvas);

        if (this.state === GameState.GAMEOVER || this.state === GameState.PAUSED) { // If it's a game state that needs the menu, draws the menu.
            this.menu.draw(this.#canvas);
        }
    }

    resize(newWidth, newHeight) {
        this.#canvas.resize(newWidth, newHeight);
        this.ball.resize(this.#canvas);
        this.player.resize(this.#canvas);
        this.obstacleManager.resize(this.#canvas);
        this.lifeCounter.resize(this.#canvas);
        this.scoreCounter.resize(this.#canvas);
        this.pauseButton.resize(this.#canvas);
        this.menu.resize(this.#canvas);
    }
    // Methods to change the "Global Constants", e.g.: current keys pressed, mouse position, ...
    addKeyPressed(key) {
        this.keysPressed.add(key);
    }

    removeKeyPressed(key) {
        this.keysPressed.delete(key);
    }

    addMousePressed(button) {
        this.mousePressed.add(button);
    }

    removeMousePressed(button) {
        this.mousePressed.delete(button);
    }

    setMousePos(x, y) {
        this.currMousePos.x = x;
        this.currMousePos.y = y;
    }

    get gameConstants() {
        return {
            keysPressed: this.keysPressed,
            mousePressed: this.mousePressed,
            mousePos: this.currMousePos,
            width: this.#canvas.width,
            height: this.#canvas.height
        };
    }
}

class GameObject { // Interface for GameObjects
    update(dt) {}
    updateWithEvents({ dt, keysPressed, mousePressed, mousePos, screenWidth, screenHeight }) {}
    draw(canvas) {}
}

class Player extends GameObject {
    constructor(centerx, centery, width, height, speed, color) {
        super();
        this.center = { x : centerx, y : centery };
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
        this.savedAttrs = { // Some "base" attributes for screen resizing.
            center: Object.assign({}, this.center),
            width: this.width,
            height: this.height,
            speed: this.speed
        };
    }

    updateWithEvents({ dt, keysPressed, mousePressed, mousePos, width: screenWidth }) {
        const mouseBtnPressed = mousePressed.has(0);
        // Controls: "d" or "a" / Left mouse button for movement. It moves to the side the mouse is in relation to the player's center (right/left).
        if (keysPressed.has("d") || (mouseBtnPressed && mousePos.x > this.center.x)) {
            this.center.x += this.speed * dt;
        }
        if (keysPressed.has("a") || (mouseBtnPressed && mousePos.x < this.center.x)) {
            this.center.x -= this.speed * dt;
        }
        // Prevents it from leaving the screen.
        if (this.center.x - this.width / 2 <= 0) {
            this.center.x = this.width / 2;
        } else if (this.center.x + this.width / 2 >= screenWidth) {
            this.center.x = screenWidth - this.width / 2;
        }
    }

    draw(canvas) {
        const topleft = {
            x: this.center.x - this.width / 2,
            y: this.center.y - this.height / 2
        };
        
        canvas.drawRoundRect(topleft.x, topleft.y, this.width, this.height, this.height / 2, { fill: this.color });
    }

    resize(canvas) {
        this.center.x = this.savedAttrs.center.x / baseScreenSize[0] * canvas.width;
        this.center.y = this.savedAttrs.center.y / baseScreenSize[1] * canvas.height;
        this.width = this.savedAttrs.width / baseScreenSize[0] * canvas.width;
        this.height = this.savedAttrs.height / baseScreenSize[1] * canvas.height;
        this.speed = this.savedAttrs.speed / baseScreenSize[0] * canvas.width;
    }
}

class Ball extends GameObject {
    constructor(x, y, radius, speed, color) {
        super();
        this.center = { x: x, y: y };
        this.radius = radius;
        this.savedRadius = this.radius; // For Resizing.
        this.speed = speed;
        this.savedSpeed = this.speed; // When the game ends, resets the ball speed.
        this.velocity = { x: 0, y: 0 };
        this.color = color;
        this.canHitPlayer = true; // It prevents the ball colliding multiple times with the player in a short amount of time.
        this.leftTheGame = false;
        this.canvasCurrentSize = Array.from(baseScreenSize); // For Resizing.
    }

    update(dt) {
        this.center.x += this.velocity.x * dt;
        this.center.y += this.velocity.y * dt;
    }

    updateWithEvents({ width: screenWidth, height: screenHeight }) {
        // Prevents it from leaving the screen.
        if (this.center.x + this.radius >= screenWidth) {
            this.velocity.x = -Math.abs(this.velocity.x);
        } else if (this.center.x - this.radius <= 0) {
            this.velocity.x = Math.abs(this.velocity.x);
        }
        
        if (this.center.y - this.radius >= screenHeight) {
            this.leftTheGame = true;
            this.canHitPlayer = false;
        } else if (this.center.y - this.radius <= 0) {
            this.velocity.y = Math.abs(this.velocity.y);
            this.canHitPlayer = true;
        }
    }

    draw(canvas) {
        canvas.drawCircle(this.center.x, this.center.y, this.radius, { fill: this.color });
    }

    setSpawnPosition(player) { // Puts it above the player for launch.
        this.center.x = player.center.x;
        this.center.y = player.center.y - player.height / 2 - this.radius * 1.05;
    }

    checkCollisionWithPlayer(player) {
        if (!this.canHitPlayer) return;
        
        const playerX = player.center.x;
        const playerY = player.center.y;
        const playerWidth = player.width;
        const playerHeight = player.height;
        // Selects the nearest point to the ball within the player's rectangle and calculates the distance between that point and the center of the ball. If it is <= to the radius, then a collision has occurred.
        const nearestX = Math.max(Math.min(this.center.x, playerX + playerWidth / 2), playerX - playerWidth / 2);
        const nearestY = Math.max(Math.min(this.center.y, playerY + playerHeight / 2), playerY - playerHeight / 2);
        const distance = Math.sqrt((this.center.x - nearestX) ** 2 + (this.center.y - nearestY) ** 2);

        if (distance <= this.radius) this.#updateVelocity(nearestX, playerX - playerWidth / 2, playerX + playerWidth / 2);
    }

    loadCollisionWithObstacle(obstacle) {
        // Changes the velocity vector based on which side the ball collides with the obstacle. Assume the ball collided.
        // Calculates the side of the obstacle based on how much the ball penetrated on each side.
        const dxLeft = (this.center.x + this.radius) - obstacle.position.x; // ball.right - rect.left
        const dxRight = (obstacle.position.x + obstacle.width) - (this.center.x - this.radius); // rect.right - ball.left
        const dyTop = (this.center.y + this.radius) - obstacle.position.y; // circle.bottom - rect.top
        const dyBottom = (obstacle.position.y + obstacle.height) - (this.center.y - this.radius); // rect.bottom - ball.top

        const minOverlapX = Math.min(dxLeft, dxRight);
        const minOverlapY = Math.min(dyTop, dyBottom);
        // Check the side where the ball penetrated the least.
        if (minOverlapX < minOverlapY) {
            if (dxLeft < dxRight) {
                this.velocity.x = -Math.abs(this.velocity.x);
            } else {
                this.velocity.x = Math.abs(this.velocity.x);
            }
        } else {
            if (dyTop < dyBottom) {
                this.velocity.y = -Math.abs(this.velocity.y);
            } else {
                this.velocity.y = Math.abs(this.velocity.y);
            }
        }

        this.canHitPlayer = true;
    }

    setRandomVelocity() {
        const angle = (Math.floor(Math.random() * (340 - 200 + 1)) + 200) * Math.PI / 180;
        this.velocity.x = this.speed * Math.cos(angle);
        this.velocity.y = this.speed * Math.sin(angle);
        this.canHitPlayer = false;
    }

    checkLaunch({ keysPressed, mousePressed, mousePos, height: screenHeight }) {
        if (keysPressed.has(" ") || (mousePressed.has(0) && mousePos.y < screenHeight / 2)) {
            // If player pressed Space or clicked on the top of the screen, launches the ball.
            this.setRandomVelocity();
            return true;
        }
        return false;
    }

    multiplySpeed(factor) {
        this.speed *= factor;
    }

    resetSpeed() {
        this.speed = this.savedSpeed;
    }

    resize(canvas) {
        this.center.x = this.center.x / this.canvasCurrentSize[0] * canvas.width;
        this.center.y = this.center.y / this.canvasCurrentSize[1] * canvas.height;
        this.radius = this.savedRadius;
        if (canvas.height / canvas.width > 1.5) {
            this.radius = this.radius / 0.7;
        }
        if (canvas.width < 400) {
            this.radius = this.radius * 0.7;
        }
        this.canvasCurrentSize = [canvas.width, canvas.height];
    }

    #updateVelocity(nearestX, playerLeftBound, playerRightBound) {
        const leftBoundAngle = 200 * Math.PI / 180; // 200 degrees in radians (min)
        const rightBoundAngle = 340 * Math.PI / 180; // 340 degrees in radians (max)
        // Based on the position on the x-axis where the ball collided with the player, calculates an angle between 200 (left) and 340 (right).
        const angleFunction = value => (leftBoundAngle - rightBoundAngle) / (playerLeftBound - playerRightBound) * (value - playerLeftBound) + leftBoundAngle; // Linear Function.
        
        this.velocity.x = this.speed * Math.cos(angleFunction(nearestX));
        this.velocity.y = this.speed * Math.sin(angleFunction(nearestX));

        this.canHitPlayer = false;
    }
}

class Obstacle extends GameObject {
    constructor(left, top, width, height, color, borderColor) {
        super();
        this.position = { x: left, y: top };
        this.width = width;
        this.height = height;
        this.color = color;
        this.borderColor = borderColor;
        this.index = null; // For resizing.
    }

    draw(canvas) {
        canvas.drawBorderedRoundRect(this.position.x, this.position.y, this.width, this.height, this.height / 6, this.height / 6, this.borderColor, this.color);
    }

    checkCollisionWithBall(ball) {
        const { x: ballX, y: ballY } = ball.center;
        const ballRadius = ball.radius;
        // Selects the nearest point to the ball within the obstacle's rectangle and calculates the distance between that point and the center of the ball. If it is <= to the radius, then a collision has occurred.
        const nearestX = Math.max(Math.min(ballX, this.position.x + this.width), this.position.x);
        const nearestY = Math.max(Math.min(ballY, this.position.y + this.height), this.position.y);
        const distance = Math.sqrt((ballX - nearestX) ** 2 + (ballY - nearestY) ** 2);

        return distance <= ballRadius;
    }
}

class ObstacleManager extends GameObject {
    constructor(screenWidth, screenHeight, amountObstacles, obstacleHeight, colors, borderColors, innerPadding, outerPadding, lines) {
        super();
        this.screenSize = { width: screenWidth, height: screenHeight };
        this.lines = lines;
        this.amountPerLine = amountObstacles;
        this.obstHeight = obstacleHeight;
        this.colors = colors;
        this.borderColors = borderColors;
        this.padding = { inner: innerPadding, outer: outerPadding };
        this.excludedObstacles = new Set(); // contains the indexes of the obstacles already broken so that, when a resizing occurs, it generates the same obstacles.
        this.obstaclesList = this.#generateObstacles();
    }

    draw(canvas) {
        this.obstaclesList.forEach(obst => {
            obst.draw(canvas);
        });
    }

    checkObstaclesState(resetEvent) {
        // Checks if there are still obstacles left to be broken.
        if (this.obstaclesList.length <= 0) {
            this.obstaclesList = this.#generateObstacles();
            resetEvent();
        }
    }

    resetObstacles() {
        this.excludedObstacles.clear();
        this.obstaclesList = this.#generateObstacles();
    }

    checkCollisionWithBall(ball, collisionEvent) {
        this.obstaclesList = this.obstaclesList.filter(obst => {
            if (obst.checkCollisionWithBall(ball)) {
                ball.loadCollisionWithObstacle(obst);
                this.excludedObstacles.add(obst.index);
                collisionEvent();
                return false;
            }
            return true;
        });
    }

    resize(canvas) {
        this.obstHeight = this.obstHeight / this.screenSize.height * canvas.height;
        this.padding.inner = this.padding.inner / this.screenSize.width * canvas.width;
        this.padding.outer = this.padding.outer / this.screenSize.width * canvas.width;
        this.screenSize.width = canvas.width;
        this.screenSize.height = canvas.height;
        this.obstaclesList = this.#generateObstacles();
    }

    #generateObstacles() {
        const obstaclesList = [];
        const obstWidth = (this.screenSize.width - this.padding.outer * 2 - this.padding.inner * (this.amountPerLine - 1)) / this.amountPerLine;
        let leftPos = this.padding.outer;
        let topPos = this.padding.outer;
        if (this.excludedObstacles.size === this.lines * this.amountPerLine) this.excludedObstacles.clear(); // If all obstacles has benn destroyed, so it is a regeneration. Clear the list of excluded ones.

        for (let i = 0; i < this.lines; i++) {
            for (let j = 1; j < this.amountPerLine + 1; j++) {
                const newObst = new Obstacle(leftPos, topPos, obstWidth, this.obstHeight, this.colors[i], this.borderColors[i]);
                newObst.index = i * this.amountPerLine + j;
                leftPos += obstWidth + this.padding.inner;
                if (this.excludedObstacles.has(newObst.index)) continue; // If that obstacle was destroyed, and it is a resizing, so doesn't generate this obstacle.
                obstaclesList.push(newObst);
            }
            leftPos = this.padding.outer;
            topPos += this.padding.inner + this.obstHeight;
        }

        return obstaclesList;
    }
}

class LifeCounter extends GameObject {
    constructor(left, top, padding, amount, radius, baseColor) {
        super();
        this.topleft = { x: left, y: top };
        this.padding = padding;
        this.amountLifes = amount;
        this.remainingLifes = this.amountLifes;
        this.radius = radius;
        this.color = baseColor;
        this.savedAttrs = { // For resizing.
            topleft: Object.assign({}, this.topleft),
            padding: this.padding,
            radius: this.radius
        };
    }

    draw(canvas) {
        let [leftPos, topPos] = [this.padding, this.padding];

        for (let i = 0; i < this.amountLifes; i++) {
            if (i < this.remainingLifes) {
                canvas.drawCircle(leftPos + this.radius, topPos + this.radius, this.radius, { fill: this.color });
            } else {
                canvas.drawInwardStrokeCircle(leftPos + this.radius, topPos + this.radius, this.radius, 0.1 * this.radius, this.color);
            }
            leftPos += this.radius * 2 + this.padding;
        }
    }

    decreaseRemainingLifes(amount = 1) {
        this.remainingLifes -= amount;
    }

    resetRemainingLifes() {
        this.remainingLifes = this.amountLifes;
    }

    resize(canvas) {
        this.topleft.x = this.savedAttrs.topleft.x / 1000 * canvas.width;
        this.topleft.y = this.savedAttrs.topleft.y / 600 * canvas.height;
        this.padding = this.savedAttrs.padding;
        this.radius = this.savedAttrs.radius;
        if (canvas.width < 400) {
            this.padding = this.savedAttrs.padding / 2;
            this.radius = this.savedAttrs.radius / 2;
        }
    }
}

class ScoreCounter extends GameObject {
    constructor(centerx, centery, color, startValue = 0, { font = "sans-serif", fontSize = "48px", fontWeight = "bold" } = {}) {
        super();
        this.center = { x: centerx, y: centery };
        this.score = startValue;
        this.color = color;
        this.fontAttributes = { font: font, size: fontSize, weight: fontWeight };
        this.highScore = this.#getHighScore();
        this.savedValues = { // For resizing
            centerY: this.center.y,
            fontSize: this.fontAttributes.size
        };
    }

    draw(canvas) {
        canvas.drawText(this.center.x, this.center.y, `${this.score}`, this.fontAttributes.font, this.fontAttributes.size, { fill: this.color }, { textAlign: "center", weight: this.fontAttributes.weight });
    }

    increaseScore(amount) {
        this.score += amount;
        this.#setHighScore(this.score);
    }

    resetScore() {
        this.score = 0;
    }

    resize(canvas) {
        this.center.x = canvas.width / 2;
        this.center.y = this.savedValues.centerY / 600 * canvas.height;
        this.fontAttributes.size = this.savedValues.fontSize;
        if (canvas.width < 400) {
            this.center.y /= 2;
            this.fontAttributes.size = Number(this.fontAttributes.size.slice(0, -2)) / 2 + "px";
        }
    }

    #getHighScore() {
        return localStorage.getItem("BBG-HighScore") ?? 0;
    }

    #setHighScore(amount) { // Save HighScore on localStorage.
        if (amount > this.highScore) {
            this.highScore = amount;
            localStorage.setItem("BBG-HighScore", amount);
        }
    }
}

class Menu extends GameObject {
    constructor(centerx, centery, fgcolor, bgcolor, { font = "sans-serif", fontSize = "48px", fontWeight = "bold" } = {}) {
        super();
        this.center = { x: centerx, y: centery };
        this.width = null;
        this.height = null;
        this.colors = { fg: fgcolor, bg: bgcolor };
        this.texts = { // Menu can serve for "Game End" or "Pause", so the these texts can change.
            title: "",
            button: ""
        }; // Depending on those texts, the dimensions of the menu and positions will also be changed.
        this.textsY = {
            title: null,
            scoresText: null,
            scoresValue: null,
            button: null
        };
        this.sizes = {
            title: null,
            text: null,
            button: null
        };
        this.fontAttributes = { font: font, size: fontSize, weight: fontWeight };
        this.scores = { current: "0", maxScore: "0" };
        this.buttonPressed = false; // If the button to restart/continue the game was pressed.
        this.fontSizeSave = this.fontAttributes.size; // For resizing.
    }

    updateWithEvents({ keysPressed, mousePressed, mousePos }) {
        this.buttonPressed = false;
        // "Enter" or Left click on the menu's lower button.
        if (keysPressed.has("Enter")) this.buttonPressed = true;
        if (mousePressed.has(0)) { // 0 == left button
            const menuTop = this.center.y - this.height / 2;
            const buttonTop = menuTop + this.textsY.button - this.sizes.button / 2; // Calculates the top of the button and checks the nearest point.
            const nearestX = Math.max(Math.min(mousePos.x, this.center.x + this.width / 2), this.center.x - this.width / 2);
            const nearestY = Math.max(Math.min(mousePos.y, buttonTop + this.sizes.button), buttonTop);
            if (mousePos.x === nearestX && mousePos.y === nearestY) this.buttonPressed = true; // If they're equal, so the click was inside the button's area.
        }
    }

    draw(canvas) {
        const topleft = {
            x: this.center.x - this.width / 2,
            y: this.center.y - this.height / 2
        };
        const commonFontAttrs = [ { fill: this.colors.fg }, { textAlign: "center", textBaseline: "middle", weight: this.fontAttributes.weight } ];
        canvas.drawRect(0, 0, canvas.width, canvas.height, { fill: "black" }, 0.3); // Darken Everything behind the menu.
        canvas.drawBorderedRoundRect(topleft.x, topleft.y, this.width, this.height, 3, 3, this.colors.fg, this.colors.bg);

        canvas.drawText(this.center.x, this.textsY.title + topleft.y, this.texts.title, this.fontAttributes.font, this.sizes.title, ...commonFontAttrs);
        canvas.drawText(this.center.x - this.width / 4, this.textsY.scoresText + topleft.y, "Score", this.fontAttributes.font, this.sizes.text, ...commonFontAttrs);
        canvas.drawText(this.center.x + this.width / 4, this.textsY.scoresText + topleft.y, "High", this.fontAttributes.font, this.sizes.text, ...commonFontAttrs);
        canvas.drawText(this.center.x - this.width / 4, this.textsY.scoresValue + topleft.y, this.scores.current, this.fontAttributes.font, this.sizes.text, ...commonFontAttrs);
        canvas.drawText(this.center.x + this.width / 4, this.textsY.scoresValue + topleft.y, this.scores.maxScore, this.fontAttributes.font, this.sizes.text, ...commonFontAttrs);
        canvas.drawRoundRect(this.center.x - this.width / 2, topleft.y + this.textsY.button - this.sizes.button / 2, this.width, this.sizes.button, 3, { fill: this.colors.fg });
        canvas.drawText(this.center.x, this.textsY.button + topleft.y, this.texts.button, this.fontAttributes.font, this.sizes.text, { fill: this.colors.bg }, { textAlign: "center", textBaseline: "middle", weight: this.fontAttributes.weight });
    }

    setTexts(canvas, title, button) {
        // Based on the texts (e.g.: in Game End -> "End of Game" and "Restart Game"), resize the entire menu based on a lot of ratios.
        const titleMetrics = canvas.getTextMetrics(title, this.fontAttributes.font, this.fontAttributes.size, this.fontAttributes.weight);
        const titleWidth = titleMetrics.width;
        const titleHeight = titleMetrics.actualBoundingBoxAscent + titleMetrics.actualBoundingBoxDescent;
        const padding = titleWidth / 6;

        this.width = titleWidth + 2 * padding;
        this.height = padding * 14 / 4 + titleHeight * 13 / 4;

        this.texts.title = title;
        this.texts.button = button;

        this.sizes.title = this.fontAttributes.size;
        this.sizes.text = Number(this.fontAttributes.size.slice(0, -2)) * 3 / 4 + "px";
        this.sizes.button = padding + titleHeight * 3 / 4;

        this.textsY.title = padding + titleHeight / 2;
        this.textsY.scoresText = (padding + titleHeight) * 3 / 2;
        this.textsY.scoresValue = padding * 2 + titleHeight * 17 / 8;
        this.textsY.button = padding * 13 / 4 + titleHeight * 5 / 2;
    }

    setScores(current, max) {
        this.scores.current = current;
        this.scores.maxScore = max;
    }

    resize(canvas) {
        this.center.x = canvas.width / 2;
        this.center.y = canvas.height / 2;
        this.fontAttributes.size = this.fontSizeSave;
        const titleWidth = canvas.getTextMetrics(this.texts.title, this.fontAttributes.font, this.fontSizeSave, this.fontAttributes.weight).width;
        if (titleWidth * 9 / 5 > canvas.width) {
            this.fontAttributes.size = Number(this.fontAttributes.size.slice(0, -2)) / 2 + "px";
        }
        this.setTexts(canvas, this.texts.title, this.texts.button);
    }
}

class PauseButton extends GameObject {
    constructor(centerx, centery, width, height, color) {
        super();
        this.center = { x: centerx, y: centery };
        this.width = width;
        this.height = height;
        this.color = color;
        this.toplefts = this.#calculateRectanglesTopleft();
        this.paused = false;
        this.previousGameState = null;
        this.savedCenter = Object.assign({}, this.center); // For resize.
        this.savedSize = { width: this.width, height: this.height }; // For resize.
    }

    updateWithEvents({ keysPressed, mousePressed, mousePos }) {
        this.paused = false;
        // "p" or click on the button.
        if (keysPressed.has("p")) this.paused = true;
        if (mousePressed.has(0)) { // 0 == left button
            const nearestX = Math.max(Math.min(mousePos.x, this.toplefts[0].x + this.width), this.toplefts[0].x);
            const nearestY = Math.max(Math.min(mousePos.y, this.toplefts[0].y + this.height), this.toplefts[0].y);
            if (mousePos.x === nearestX && mousePos.y === nearestY) this.paused = true;
        }
    }

    draw(canvas) {
        canvas.drawRect(this.toplefts[0].x, this.toplefts[0].y, this.width / 3, this.height, { fill: this.color });
        canvas.drawRect(this.toplefts[1].x, this.toplefts[1].y, this.width / 3, this.height, { fill: this.color });
    }

    getPreviousGameState() {
        const state = this.previousGameState;
        this.previousGameState = null;
        return state;
    }

    setPreviousGameState(state) {
        this.previousGameState = state;
    }

    resize(canvas) {
        this.center.x = this.savedCenter.x / 1000 * canvas.width;
        this.center.y = this.savedCenter.y / 600 * canvas.height;
        this.width = this.savedSize.width;
        this.height = this.savedSize.height;
        if (canvas.width < 400) {
            this.center.y /= 2;
            this.width = this.width / 2;
            this.height = this.height / 2;
        }
        this.toplefts = this.#calculateRectanglesTopleft();
    }

    #calculateRectanglesTopleft() {
        // The Pause button is made up of 2 rectangles, one on the left and one on the right, with 1/3 of the total width of the button (to leave a space between them).
        const topleft1 = { x: 0, y: 0 };
        topleft1.x += this.center.x - this.width / 2;
        topleft1.y += this.center.y - this.height / 2;
        const topleft2 = { x: 0, y: 0 };
        topleft2.x = topleft1.x + this.width * 2 / 3;
        topleft2.y = topleft1.y;
        return [ topleft1, topleft2 ];
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = new Game(ctx, baseScreenSize[0], baseScreenSize[1]); // Start the game as 1000x600.
game.resize(window.innerWidth, window.innerHeight); // Resizes it appropriately.
game.loop(0); // Starts game loop.
// Event Listeners for resizing and get user inputs.
window.addEventListener("resize", () => {
    game.resize(window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", e => {
    game.addKeyPressed(e.key);
});

window.addEventListener("keyup", e => {
    game.removeKeyPressed(e.key);
});

window.addEventListener("mousedown", e => {
    game.addMousePressed(e.button);
});

window.addEventListener("mouseup", e => {
    game.removeMousePressed(e.button);
});

window.addEventListener("mousemove", e => {
    game.setMousePos(e.x, e.y);
});
// Treats touch as mouse clicks.
window.addEventListener("touchstart", () => {
    game.addMousePressed(0);
});

window.addEventListener("touchend", () => {
    game.removeMousePressed(0);
});

window.addEventListener("touchmove", e => {
    game.setMousePos(e.touches[0].clientX, e.touches[0].clientY);
});
