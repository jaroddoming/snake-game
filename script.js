// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define grid size and canvas size
const gridSize = 20;
const canvasSize = 400;

// Initialize game variables
let snake = [{ x: 200, y: 200 }]; // Snake starts at the center
let food = { x: 100, y: 100 }; // Initialize food
let dx = 0; // Snake movement in the X direction
let dy = 0; // Snake movement in the Y direction
let score = 0; // Player's score
let gameStarted = false; // Flag to check if the game has started

// Draw a rectangle (used for both the snake and food)
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, gridSize, gridSize);
}

// Draw the snake
function drawSnake() {
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? "green" : "lime");
  });
}

// Draw the food
function drawFood() {
  drawRect(food.x, food.y, "red");
}

// Move the snake
function moveSnake() {
  if (!gameStarted) return; // Do not move until the game starts

  // Create a new head based on the current direction
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head); // Add new head to the snake

  // Check if the snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++; // Increase score
    placeFood(); // Place new food
  } else {
    snake.pop(); // Remove the last segment if no food is eaten
  }
}

// Place food at a random position
function placeFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

// Check for collisions (wall or self)
function checkCollision() {
  if (
    snake[0].x < 0 || // Hits left wall
    snake[0].x >= canvasSize || // Hits right wall
    snake[0].y < 0 || // Hits top wall
    snake[0].y >= canvasSize || // Hits bottom wall
    snake
      .slice(1)
      .some((segment) => segment.x === snake[0].x && segment.y === snake[0].y) // Hits itself
  ) {
    document.getElementById("scoreMessage").innerText =
      "Fin del juego. Puntuación: " + score;
    document.getElementById("gameOverMessage").style.display = "block";
    gameStarted = false; // Stop the game
  }
}

// Restart the game by reloading the page
function restartGame() {
  document.location.reload();
}

// Change snake direction based on arrow key input
function changeDirection(event) {
  const key = event.keyCode;
  
  // Start the game if an arrow key is pressed
  if (!gameStarted && (key === 37 || key === 38 || key === 39 || key === 40)) {
    gameStarted = true;
    gameLoop();
  }

  // Prevent reversing direction
  if (key === 37 && dx === 0) { // Left arrow
    dx = -gridSize;
    dy = 0;
  }
  if (key === 38 && dy === 0) { // Up arrow
    dx = 0;
    dy = -gridSize;
  }
  if (key === 39 && dx === 0) { // Right arrow
    dx = gridSize;
    dy = 0;
  }
  if (key === 40 && dy === 0) { // Down arrow
    dx = 0;
    dy = gridSize;
  }
}

// Listen for key presses
document.addEventListener("keydown", changeDirection);

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
  moveSnake(); // Move the snake
  checkCollision(); // Check for collisions
  drawSnake(); // Draw the snakes
  drawFood(); // Draw the food
  setTimeout(gameLoop, 100); // Run game loop every 100ms
}

// Initialize the game by placing food and drawing the initial snake
placeFood();
drawSnake();
drawFood();

// Ensure the canvas can receive keyboard input
document.addEventListener("DOMContentLoaded", () => {
  canvas.setAttribute("tabindex", "0");
  canvas.focus();
  canvas.addEventListener("click", () => canvas.focus());
});
