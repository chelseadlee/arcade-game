var CANVAS_WIDTH = 505;

/*************** Enemy section ***************/
// Enemies our player must avoid
var Enemy = function(x, y) {
    this.startingX = x;
    this.x = x;
    this.y = y;
    this.speed = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Set enemy speed using random number generator
Enemy.prototype.setSpeed = function(min, max) {
    this.speed = Math.floor(Math.random() * (max - min + 1)) + min;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > CANVAS_WIDTH) {
        this.reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemy to starting x position
Enemy.prototype.reset = function() {
    this.x = this.startingX;
}

/*************** Mode section ***************/
var score = 0;

// Set mode (easy, medium, hard) depending on score and display appropriate alert message
var setMode = function() {
    var currentDifficulty = currentMode.difficultyLevel;
    if (score < 5) {
        currentMode.easy();
    } else if (score < 10) {
        currentMode.medium();
        if (currentDifficulty !== currentMode.difficultyLevel) {
            alert("level up!");
        }
    } else if (score < 20) {
        currentMode.hard();
        if (currentDifficulty !== currentMode.difficultyLevel) {
            alert("level up!");
        }
    } else if (score === 20) {
        alert("YOU WIN!!");
    }
};

var Mode = function() {
    this.difficultyLevel = null;

    // Instantiate enemies
    var enemy1 = new Enemy(0, 230);

    var enemy2 = new Enemy(0, 145);

    var enemy3 = new Enemy(-40, 145);

    var enemy4 = new Enemy(-180, 60);

    var enemy5 = new Enemy(-200, 230);

    var enemy6 = new Enemy(-20, 145);

    var enemy7 = new Enemy(-90, 230);

    var enemy8 = new Enemy(-280, 60);

    // Set number of enemies for easy, medium and hard modes
    this.easyEnemies = [enemy1, enemy2, enemy3, enemy4];
    this.mediumEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];
    this.hardEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8];
    this.allEnemies = [];
};

Mode.prototype.easy = function() {
    this.difficultyLevel = "easy";
    this.allEnemies = this.easyEnemies;

    // Set speed of enemies in easy mode
    this.allEnemies.forEach(function(enemy) {
        enemy.setSpeed(30, 80);
    })
};

Mode.prototype.medium = function() {
    this.difficultyLevel = "medium";
    this.allEnemies = this.mediumEnemies;

    // Set speed of enemies in medium mode
    this.allEnemies.forEach(function(enemy) {
        enemy.setSpeed(70, 120);
    })
};

Mode.prototype.hard = function() {
    this.difficultyLevel = "hard";
    this.allEnemies = this.hardEnemies;

    // Set speed of enemies in hard mode
    this.allEnemies.forEach(function(enemy) {
        enemy.setSpeed(100, 140);
    })
};

/*************** Player section ***************/
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-cat-girl.png';
};

// Reset player starting position
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

// Check to see if player makes it to water
Player.prototype.checkWin = function() {
    if (this.y <= -10) {
        this.reset();
        score++;
        setMode();
        console.log(score);
    }
};

Player.prototype.update = function() {
    this.checkWin();
    this.handleInput();
    this.checkCollisions();
};

Player.prototype.handleInput = function(direction) {
    var hMovement = 101;
    var vMovement = 83;

    switch (direction) {
        case 'left':
            this.x = this.x - hMovement > 0 ? this.x - hMovement : -10;
            break;
        case 'right':
            this.x = this.x + hMovement < 410 ? this.x + hMovement : 410;
            break;
        case 'down':
            this.y = this.y + vMovement < 435 ? this.y + vMovement : 435;
            break;
        case 'up':
            this.y = this.y - vMovement > -10 ? this.y - vMovement : -10;
            break;
    }
};

// Check player's position against all enemies
Player.prototype.checkCollisions = function() {

    for (enemy = 0; enemy < 4; enemy++) {
        var playerHeight = 50;
        var playerWidth = 50;
        var spriteHeight = 45;
        var spriteWidth = 60;
        if (currentMode.allEnemies[enemy].x < this.x + playerWidth &&
            currentMode.allEnemies[enemy].x + spriteWidth > this.x &&
            currentMode.allEnemies[enemy].y < this.y + playerHeight &&
            spriteHeight + currentMode.allEnemies[enemy].y > this.y) {
            console.log("collision");
            this.reset();

            // Penalty: score is reduced
            score--;
            setMode();
            console.log(score);
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Score text
    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 0, 580);
};

// Instantiate Player object
var player = new Player(200, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});