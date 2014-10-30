/* ----------------------------------------------------------------------------
 * Variables
 * ----------------------------------------------------------------------------
 */

// Snake Variables

var snake;
var snakeLength;     
var snakeSize;        
var snakeDirection;   

var food; // Food Variable

//Screen Variables

var context;
var screenWidth;
var screenHeight;
var availHeight;

// Game State Variables

var gameState;
var gameOverMenu;
var startMenu;
var restartButton;
var playHUD;
var scoreboard;

/* ----------------------------------------------------------------------------
 * Called Functions
 * ----------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000/30); // This makes the function in pparenthesses to loop in milliseconds.

/* ----------------------------------------------------------------------------
 * Game Functions
 * ----------------------------------------------------------------------------
 */

function gameInitialize() { // Tells the game what to do when it is first booted up.
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d"); 
    
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    availHeight = screen.availHeight;
    
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    document.addEventListener("keydown", keyboardHandler);
    
    startMenu = document.getElementById("start");
    centerMenuPosition(startMenu);
    
    startButton = document.getElementById("startButton");
    startButton.addEventListener("click", gameRestart);
    
    setState("START");
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    playHUD = document.getElementById("playHUD");    
    scoreboard = document.getElementById("scoreboard");
}

function gameLoop() { // Tells the game to keep repeating these functions.
    gameDraw();           
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
        drawScoreboard();
        hideMenu(startMenu);
    }
}

function gameDraw() { // Draws the game background's color to take up the whole screen.
    context.fillStyle = "rgb(67, 196, 84)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameRestart() { // Tells the game to do this when the game restarts.
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
}

/* ----------------------------------------------------------------------------
 * Snake Functions
 * ----------------------------------------------------------------------------
 */

function snakeInitialize() { //  Tells the snake how long and big the snake to be and tells it to go down.
    snake = [];
    snakeLength = 1;
    snakeSize = 20;
    snakeDirection = "right";
    
    for(var index = snakeLength - 1; index >= 0; index--) { // 
        snake.push( {
            x: index,
            y: 0
        });
    }
}

function snakeDraw() { // Draws the snake's color and makes the snake like a line.
    for(var index = 0; index < snake.length; index++) {
        context.fillStyle = "blue";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        context.strokeStyle = "rgb(255, 179, 0)";
        context.strokeRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() { // Updates the snake after it has eaten a piece of food.
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;
    
    // Tells the snake to first go down. If it can't, then go right. If it can't, then go left. If it can't, then go up.
    
    if(snakeDirection === "down") { 
        snakeHeadY++;
    }
    else if(snakeDirection === "right") {
        snakeHeadX++;
    }
    else if(snakeDirection === "left") {
        snakeHeadX--;
    }
    else if(snakeDirection === "up") {
        snakeHeadY--;
    }
    
    //
    
    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);
    
    // 
 
    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/* ----------------------------------------------------------------------------
 * Food Functions
 * ----------------------------------------------------------------------------
 */

function foodInitialize() { // Sets where the food is first placed.
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() { // Draws the food a certain color and certain size.
    context.fillStyle = "yellow";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() { // Sets the food in a random position somewhere on the snake grid when it is eaten.
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);
    
    checkFoodCollisions(randomX, randomY);
    
    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}

/* ----------------------------------------------------------------------------
 * Keyboard/Input Functions
 * ----------------------------------------------------------------------------
 */


function keyboardHandler(event) { // Tells the console what key was pressed down and its key code.
    console.log(event);
    
    // The following lines of code control the snake movement.
    
    if(event.keyCode == "39" && snakeDirection != "left" || event.keyCode == "68" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if(event.keyCode == "40" && snakeDirection != "up" || event.keyCode == "83" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if(event.keyCode == "37" && snakeDirection != "right" || event.keyCode == "65" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    else if(event.keyCode == "38" && snakeDirection != "down" || event.keyCode == "87" && snakeDirection != "down") {
        snakeDirection = "up";
    }
}

/* ----------------------------------------------------------------------------
 * Collision Functions
 * ----------------------------------------------------------------------------
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY, randomX, randomY) { // Checks to see if the snake ate the food and then sets it in a random position when it is eaten.
    if(snakeHeadX === food.x && snakeHeadY === food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
        
        randomX = Math.floor(Math.random() * screenWidth);
        randomY = Math.floor(Math.random() * screenHeight);
        
        food.x = Math.floor(randomX / snakeSize);
        food.y = Math.floor(randomY / snakeSize);
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) { // Checks to see if the snake hit the wall.
    var useHeight;
    if(availHeight < screenHeight){
        useHeight = availHeight;
    }
    else{
        useHeight = screenHeight;
    }
    
    if(snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0 || 
       snakeHeadY * snakeSize >= useHeight || snakeHeadY * snakeSize < 0) {
       setState("GAME OVER");
    }
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) { // Checks to see if the snake hit itself.
    for(var index = 1; index < snake.length; index++) {
        if(snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            setState("GAME OVER");
        }
    }
}

/* ----------------------------------------------------------------------------
 * Game State Functions
 * ----------------------------------------------------------------------------
 */

function  setState(state) { //
    gameState = state;
    showMenu(state);
}

/* ----------------------------------------------------------------------------
 * Menu Functions
 * ----------------------------------------------------------------------------
 */

function displayMenu(menu) { // This shows a menu when needed.
    menu.style.visibility = "visible";
}

function hideMenu(menu) { // This hides a menu when needed.
    menu.style.visibility = "hidden";
}

function showMenu(state) { // Shows what menu to use under certain cases.
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if(state == "PLAY") {
        displayMenu(playHUD);
    }
    else if(state == "START") {
        displayMenu(startMenu);
    }
}

function centerMenuPosition(menu) { // Centers the menu.
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard() { // Draws the scoreboard ans displays the length of the snake.
    scoreboard.innerHTML = "Length: " + snakeLength;
}