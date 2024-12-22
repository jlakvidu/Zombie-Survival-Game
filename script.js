const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const healthBar = document.getElementById('health-bar');
const scoreDisplay = document.getElementById('score');

const gameWidth = gameContainer.offsetWidth;
const gameHeight = gameContainer.offsetHeight;

let score = 0;
let playerHealth = 100;
let zombies = [];
let bullets = [];
let zombieSpeed = 1;
let keys = {};

let playerX = gameWidth / 2;
let playerY = gameHeight / 2;

const playerSpeed = 5;

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

document.addEventListener('click', (e) => {
  const rect = gameContainer.getBoundingClientRect();
  const bullet = {
    x: playerX + 16,
    y: playerY + 16,
    dx: (e.clientX - rect.left - playerX) / 10,
    dy: (e.clientY - rect.top - playerY) / 10
  };
  bullets.push(bullet);
});

function updatePlayer() {
  if (keys['w'] && playerY > 0) playerY -= playerSpeed;
  if (keys['s'] && playerY < gameHeight - 32) playerY += playerSpeed;
  if (keys['a'] && playerX > 0) playerX -= playerSpeed;
  if (keys['d'] && playerX < gameWidth - 32) playerX += playerSpeed;

  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
}

function spawnZombie() {
  const zombie = document.createElement('div');
  zombie.classList.add('zombie');
  zombie.style.left = `${Math.random() * gameWidth}px`;
  zombie.style.top = `${Math.random() < 0.5 ? 0 : gameHeight}px`;
  gameContainer.appendChild(zombie);
  zombies.push(zombie);
}

function updateZombies() {
  zombies.forEach((zombie, index) => {
    const zombieX = zombie.offsetLeft;
    const zombieY = zombie.offsetTop;

    const dx = playerX - zombieX;
    const dy = playerY - zombieY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    zombie.style.left = `${zombieX + (dx / distance) * zombieSpeed}px`;
    zombie.style.top = `${zombieY + (dy / distance) * zombieSpeed}px`;

    if (distance < 32) {
      playerHealth -= 10;
      healthBar.style.width = `${playerHealth}%`;
      if (playerHealth <= 0) {
        alert('Game Over!');
        location.reload();
      }
    }
  });
}

function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    if (bullet.x < 0 || bullet.x > gameWidth || bullet.y < 0 || bullet.y > gameHeight) {
      bullets.splice(index, 1);
      return;
    }

    zombies.forEach((zombie, zIndex) => {
      const zombieX = zombie.offsetLeft + 16;
      const zombieY = zombie.offsetTop + 16;
      const distance = Math.sqrt((bullet.x - zombieX) ** 2 + (bullet.y - zombieY) ** 2);

      if (distance < 16) {
        zombie.remove();
        zombies.splice(zIndex, 1);
        bullets.splice(index, 1);
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });

    const bulletEl = document.createElement('div');
    bulletEl.classList.add('bullet');
    bulletEl.style.left = `${bullet.x}px`;
    bulletEl.style.top = `${bullet.y}px`;
    gameContainer.appendChild(bulletEl);

    setTimeout(() => bulletEl.remove(), 100);
  });
}

function gameLoop() {
  updatePlayer();
  updateZombies();
  updateBullets();

  if (Math.random() < 0.02) spawnZombie();

  requestAnimationFrame(gameLoop);
}

gameLoop();
