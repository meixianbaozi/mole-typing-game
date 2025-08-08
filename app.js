const gameArea   = document.getElementById('game-area');
const scoreEl    = document.getElementById('score');
const highScoreEl= document.getElementById('high-score');
const restartBtn = document.getElementById('restart');
const hitSound   = document.getElementById('hit-sound');
const missSound  = document.getElementById('miss-sound');

let score = 0;
let highScore = parseInt(localStorage.getItem('mole-typing-high') || '0');
let spawnInterval = 2000;
let running = false;
let spawnTimer;

highScoreEl.textContent = highScore;

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  spawnInterval = 2000;
  running = true;
  spawnMole();
  spawnTimer = setInterval(spawnMole, spawnInterval);
}

function spawnMole() {
  if (!running) return;

  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const hole = document.createElement('div');
  hole.className = 'hole';
  hole.style.left = `${Math.random() * (window.innerWidth - 100)}px`;
  hole.style.top  = `${Math.random() * (window.innerHeight - 200) + 50}px`;

  const mole = document.createElement('div');
  mole.className = 'mole';
  const label = document.createElement('span');
  label.textContent = letter;
  mole.appendChild(label);
  hole.appendChild(mole);
  gameArea.appendChild(hole);

  const remove = () => {
    gameArea.removeChild(hole);
    missSound.currentTime = 0;
    missSound.play();
  };

  const timeout = setTimeout(remove, spawnInterval - 200);

  function keyHandler(e) {
    if (e.key.toUpperCase() === letter) {
      clearTimeout(timeout);
      mole.style.transform = 'translateY(100px)';
      hitSound.currentTime = 0;
      hitSound.play();
      score++;
      scoreEl.textContent = score;
      updateDifficulty();
      setTimeout(() => gameArea.removeChild(hole), 100);
      document.removeEventListener('keydown', keyHandler);
    }
  }
  document.addEventListener('keydown', keyHandler);
}

function updateDifficulty() {
  if (spawnInterval > 500) {
    spawnInterval -= 100;
    clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnMole, spawnInterval);
  }
}

function endGame() {
  running = false;
  clearInterval(spawnTimer);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('mole-typing-high', highScore);
    highScoreEl.textContent = highScore;
  }
}

restartBtn.addEventListener('click', () => {
  endGame();
  gameArea.innerHTML = '';
  startGame();
});

window.addEventListener('keydown', (e) => {
  if (!running && e.key === 'Enter') startGame();
});

// 自动开始
startGame();
