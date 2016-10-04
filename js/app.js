// Enemies our player must avoid
var CANVAS_WIDTH = 505;

var Enemy = function(x,y) {
    this.startingX = x;
    this.x = x;
    this.y = y;
    this.speed = Math.floor(Math.random() * 70) + 30;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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

var setMode = function() {
    if (score < 5) {
        currentMode.easy();
    } else if (score < 10) {
        currentMode.medium();
    } else if (score < 20) {
        setMode();
    } else if (score === 20) {
        console.log("you win!");
    }
};

var Mode = function(){
    var enemy1 = new Enemy(0,230);

    var enemy2 = new Enemy(0,145);

    var enemy3 = new Enemy(-40,145);

    var enemy4 = new Enemy(-180,60);

    var enemy5 = new Enemy(-200,230);

    var enemy6 = new Enemy(-20,145);

    var enemy7 = new Enemy(-90,145);

    var enemy8 = new Enemy(-280,60);

    this.easyEnemies = [enemy1, enemy2, enemy3, enemy4];
    this.mediumEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8];

    this.allEnemies = [];
};

Mode.prototype.easy = function(){
    this.allEnemies = this.easyEnemies;
};

Mode.prototype.medium = function(){
    this.allEnemies = this.mediumEnemies;
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
    this.x = this.startingX;
}

/*************** player section ***************/
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-cat-girl.png';
};

Player.prototype.reset = function() {
    this.x = 200;
    this.y = 435;
};

Player.prototype.checkWin = function() {
    if (this.y <= -10) {
        this.reset();
        console.log("you win!");
        score ++;
        console.log(score);
    }
};

Player.prototype.update = function(){
    setMode();
    this.checkWin();
    this.handleInput();
    this.checkCollisions();
   };

Player.prototype.handleInput = function(direction){
    var movement = 50;

    switch(direction) {
        case 'left' :
            this.x = this.x - movement > 0 ? this.x - movement : -10;
            break;
        case 'right' :
            this.x = this.x + movement < 410 ? this.x + movement : 410;
            break;
        case 'down' :
            this.y = this.y + movement < 435 ? this.y +  movement : 435;
            break;
        case 'up' :
            this.y = this.y - movement > -10 ? this.y - movement : -10;
            break;
    }
};

Player.prototype.checkCollisions = function(){

    for (enemy = 0; enemy < 4; enemy++) {
        var playerHeight = 50;
        var playerWidth = 50;
        var spriteHeight = 45;
        var spriteWidth = 60;
        if (currentMode.allEnemies[enemy].x < player.x + playerWidth &&
            currentMode.allEnemies[enemy].x + spriteWidth > player.x &&
            currentMode.allEnemies[enemy].y < player.y + playerHeight &&
            spriteHeight + currentMode.allEnemies[enemy].y > player.y) {
                console.log("collision");
                player.reset();
                score --;
                console.log(score);
        }
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: "+score, 0, 580);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var player = new Player(200, 435);



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

// keep score and level up

var score = 0;