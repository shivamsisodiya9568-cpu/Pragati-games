/* ============================================
   Pragati Kids Games - Main JavaScript File
   Created by Pragati Sahayak
   ============================================ */

'use strict';

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.6s ease';
      setTimeout(() => loading.remove(), 600);
    }
  }, 2000);
});

// ============================================
// DARK / LIGHT MODE TOGGLE
// ============================================
(function ThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;

  // Load saved preference (default = dark)
  const saved = localStorage.getItem('pkgTheme');
  if (saved === 'light') body.classList.add('light');

  if (btn) {
    btn.addEventListener('click', () => {
      body.classList.toggle('light');
      const isLight = body.classList.contains('light');
      localStorage.setItem('pkgTheme', isLight ? 'light' : 'dark');
      showToast(isLight ? '☀️ Light Mode On!' : '🌙 Dark Mode On!', 1600);
    });
  }
})();

// ============================================
// NAVBAR - Hamburger Menu
// ============================================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(msg, duration = 2500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================
// WIN OVERLAY & CONFETTI
// ============================================
function showWinOverlay(emoji, title, msg) {
  const overlay = document.getElementById('winOverlay');
  document.getElementById('winEmoji').textContent = emoji;
  document.getElementById('winTitle').textContent = title;
  document.getElementById('winMsg').textContent = msg;
  overlay.classList.add('show');
  spawnConfetti();
}

function closeWinOverlay() {
  document.getElementById('winOverlay').classList.remove('show');
}

function spawnConfetti() {
  const colors = ['#6C63FF','#FF6584','#43E97B','#FFD93D','#FF9A3C','#4FC3F7','#CE93D8'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left:${Math.random()*100}vw;
      top:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      transform:rotate(${Math.random()*360}deg);
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*0.5}s;
      width:${6+Math.random()*10}px;
      height:${6+Math.random()*10}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
    `;
    document.querySelector('.confetti').appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ============================================
// ============================================
// GAME 1: TIC TAC TOE
// ============================================
// ============================================
(function TicTacToe() {
  let board = Array(9).fill('');
  let current = 'X';
  let gameActive = true;
  let scores = { X: 0, O: 0, draw: 0 };

  const cells = document.querySelectorAll('.ttt-cell');
  const status = document.getElementById('tttStatus');
  const scoreX = document.getElementById('tttScoreX');
  const scoreO = document.getElementById('tttScoreO');

  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
      cell.className = 'ttt-cell' + (board[i] ? ' taken' : '');
      if (board[i] === 'X') cell.classList.add('x');
      if (board[i] === 'O') cell.classList.add('o');
    });
  }

  function checkWin() {
    for (const [a,b,c] of wins) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return [a,b,c];
    }
    return null;
  }

  function handleClick(i) {
    if (!gameActive || board[i]) return;
    board[i] = current;
    render();
    const winner = checkWin();
    if (winner) {
      winner.forEach(idx => cells[idx].classList.add('win'));
      scores[current]++;
      updateScore();
      status.textContent = `🎉 Player ${current} Wins!`;
      status.style.color = current === 'X' ? '#FF6584' : '#4FC3F7';
      gameActive = false;
      showToast(`🏆 Player ${current} wins! Great move!`);
      return;
    }
    if (board.every(c => c)) {
      status.textContent = `🤝 It\'s a Draw!`;
      status.style.color = '#FFD93D';
      scores.draw++;
      gameActive = false;
      return;
    }
    current = current === 'X' ? 'O' : 'X';
    status.textContent = `Player ${current}'s turn ${current === 'X' ? '❌' : '⭕'}`;
    status.style.color = current === 'X' ? '#FF6584' : '#4FC3F7';
  }

  function updateScore() {
    if (scoreX) scoreX.textContent = scores.X;
    if (scoreO) scoreO.textContent = scores.O;
  }

  function resetGame() {
    board = Array(9).fill('');
    current = 'X'; gameActive = true;
    status.textContent = `Player X's turn ❌`;
    status.style.color = '#FF6584';
    render();
  }

  cells.forEach((cell, i) => cell.addEventListener('click', () => handleClick(i)));
  document.getElementById('tttReset')?.addEventListener('click', resetGame);
  resetGame();
})();

// ============================================
// ============================================
// GAME 2: MEMORY CARD GAME
// ============================================
// ============================================
(function MemoryGame() {
  const emojis = ['🦄','🐶','🦊','🐸','🦁','🐼','🐯','🦋'];
  let cards = [...emojis, ...emojis];
  let flipped = [], matched = [], locked = false, moves = 0;

  const grid = document.getElementById('memGrid');
  const movesEl = document.getElementById('memMoves');
  const statusEl = document.getElementById('memStatus');

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildGrid() {
    shuffle(cards);
    grid.innerHTML = '';
    flipped = []; matched = []; moves = 0;
    if (movesEl) movesEl.textContent = '0';
    if (statusEl) statusEl.textContent = 'Find all matching pairs! 🔍';
    cards.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.index = i;
      card.dataset.emoji = emoji;
      card.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-front">❓</div>
          <div class="mem-back">${emoji}</div>
        </div>`;
      card.addEventListener('click', () => flipCard(card));
      grid.appendChild(card);
    });
  }

  function flipCard(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if (flipped.length === 2) {
      locked = true; moves++;
      if (movesEl) movesEl.textContent = moves;
      setTimeout(checkMatch, 800);
    }
  }

  function checkMatch() {
    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched'); b.classList.add('matched');
      matched.push(a, b);
      if (statusEl) statusEl.textContent = '✅ Match found! Keep going!';
      if (matched.length === cards.length) {
        if (statusEl) statusEl.textContent = '🎉 You found all pairs!';
        showWinOverlay('🏆', 'Memory Master!', `You matched all pairs in ${moves} moves! Amazing!`);
      }
    } else {
      a.classList.remove('flipped'); b.classList.remove('flipped');
      if (statusEl) statusEl.textContent = '❌ Not a match! Try again!';
    }
    flipped = []; locked = false;
  }

  document.getElementById('memReset')?.addEventListener('click', buildGrid);
  buildGrid();
})();

// ============================================
// ============================================
// GAME 3: NUMBER GUESSING GAME
// ============================================
// ============================================
(function NumberGuessing() {
  let secret, attempts, maxAttempts = 7, gameActive;
  let totalWins = 0;

  const input = document.getElementById('guessInput');
  const feedback = document.getElementById('guessFeedback');
  const emoji = document.getElementById('guessEmoji');
  const history = document.getElementById('guessHistory');
  const winsEl = document.getElementById('guessWins');
  const attemptsEl = document.getElementById('guessAttempts');

  function startGame() {
    secret = Math.floor(Math.random() * 100) + 1;
    attempts = 0; gameActive = true;
    if (input) input.value = '';
    if (feedback) { feedback.textContent = 'I\'m thinking of a number from 1 to 100!'; feedback.className = 'guess-feedback'; }
    if (emoji) emoji.textContent = '🤔';
    if (history) history.textContent = 'Your guesses will appear here...';
    if (attemptsEl) attemptsEl.textContent = `${maxAttempts - attempts} left`;
  }

  function makeGuess() {
    if (!gameActive) return;
    const val = parseInt(input?.value);
    if (isNaN(val) || val < 1 || val > 100) {
      showToast('⚠️ Please enter a number between 1 and 100!'); return;
    }
    attempts++;
    const remaining = maxAttempts - attempts;
    if (attemptsEl) attemptsEl.textContent = `${remaining} left`;

    if (val === secret) {
      feedback.textContent = `🎉 Correct! The number was ${secret}!`;
      feedback.className = 'guess-feedback correct';
      emoji.textContent = '🥳';
      totalWins++;
      if (winsEl) winsEl.textContent = totalWins;
      gameActive = false;
      showWinOverlay('🎯', 'Brilliant!', `You guessed ${secret} in ${attempts} attempt${attempts>1?'s':''}!`);
    } else if (attempts >= maxAttempts) {
      feedback.textContent = `😢 Out of attempts! The number was ${secret}!`;
      feedback.className = 'guess-feedback too-high';
      emoji.textContent = '😢';
      gameActive = false;
      showToast(`Game over! The secret was ${secret}. Try again!`, 3000);
    } else if (val < secret) {
      feedback.textContent = `📈 Too Low! Try higher!`;
      feedback.className = 'guess-feedback too-low';
      emoji.textContent = '⬆️';
    } else {
      feedback.textContent = `📉 Too High! Try lower!`;
      feedback.className = 'guess-feedback too-high';
      emoji.textContent = '⬇️';
    }

    // Update guess history
    const prev = history.textContent === 'Your guesses will appear here...' ? '' : history.textContent + ', ';
    history.textContent = prev + val;
    input.value = '';
    input.focus();
  }

  document.getElementById('guessBtn')?.addEventListener('click', makeGuess);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') makeGuess(); });
  document.getElementById('guessReset')?.addEventListener('click', startGame);
  startGame();
})();

// ============================================
// ============================================
// GAME 4: ROCK PAPER SCISSORS
// ============================================
// ============================================
(function RockPaperScissors() {
  const choices = ['✊', '✋', '✌️'];
  const names = ['Rock', 'Paper', 'Scissors'];
  let scores = { player: 0, computer: 0 };

  const resultEl = document.getElementById('rpsResult');
  const playerShow = document.getElementById('rpsPlayerShow');
  const compShow = document.getElementById('rpsCompShow');
  const pScoreEl = document.getElementById('rpsPlayerScore');
  const cScoreEl = document.getElementById('rpsCompScore');
  const btns = document.querySelectorAll('.rps-btn');

  function play(playerIdx) {
    const compIdx = Math.floor(Math.random() * 3);
    if (playerShow) playerShow.textContent = choices[playerIdx];
    if (compShow) compShow.textContent = choices[compIdx];

    // Remove selected class from all
    btns.forEach(b => b.classList.remove('selected'));
    btns[playerIdx]?.classList.add('selected');

    setTimeout(() => {
      let result = '';
      if (playerIdx === compIdx) {
        result = "🤝 It's a Draw!";
        resultEl.className = 'rps-result rps-draw';
      } else if (
        (playerIdx === 0 && compIdx === 2) ||
        (playerIdx === 1 && compIdx === 0) ||
        (playerIdx === 2 && compIdx === 1)
      ) {
        result = `🎉 You Win! ${names[playerIdx]} beats ${names[compIdx]}!`;
        resultEl.className = 'rps-result rps-win';
        scores.player++;
      } else {
        result = `😢 Computer Wins! ${names[compIdx]} beats ${names[playerIdx]}!`;
        resultEl.className = 'rps-result rps-lose';
        scores.computer++;
      }
      if (resultEl) resultEl.textContent = result;
      if (pScoreEl) pScoreEl.textContent = scores.player;
      if (cScoreEl) cScoreEl.textContent = scores.computer;

      if (scores.player === 5) {
        showWinOverlay('🏆','You\'re a Champion!','You won 5 rounds in Rock Paper Scissors!');
        scores.player = 0; scores.computer = 0;
        if (pScoreEl) pScoreEl.textContent = 0;
        if (cScoreEl) cScoreEl.textContent = 0;
      }
    }, 300);
  }

  btns.forEach((btn, i) => btn.addEventListener('click', () => play(i)));

  document.getElementById('rpsReset')?.addEventListener('click', () => {
    scores = { player: 0, computer: 0 };
    if (pScoreEl) pScoreEl.textContent = 0;
    if (cScoreEl) cScoreEl.textContent = 0;
    if (resultEl) resultEl.textContent = '';
    if (playerShow) playerShow.textContent = '❓';
    if (compShow) compShow.textContent = '❓';
    btns.forEach(b => b.classList.remove('selected'));
  });
})();

// ============================================
// ============================================
// GAME 5: CLICK THE BALL GAME
// ============================================
// ============================================
(function ClickTheBall() {
  const arena = document.getElementById('ballArena');
  const scoreEl = document.getElementById('ballScore');
  const bestEl = document.getElementById('ballBest');
  const timerBar = document.getElementById('ballTimerBar');
  const startBtn = document.getElementById('ballStartBtn');

  let score = 0, best = 0, gameActive = false, timer, timeLeft = 30, ball = null;
  const colors = ['#FF6584','#6C63FF','#43E97B','#FFD93D','#FF9A3C','#4FC3F7','#CE93D8'];
  const emojis = ['⚽','🏀','🎾','🏐','🎱','🏈','🎯','💫','⭐','🌟'];

  function getBallSize() {
    const w = arena.offsetWidth, h = arena.offsetHeight;
    return { w, h, size: Math.max(40, Math.min(65, w * 0.15)) };
  }

  function spawnBall() {
    if (ball) ball.remove();
    const { w, h, size } = getBallSize();
    ball = document.createElement('div');
    ball.className = 'ball';
    const x = Math.random() * (w - size);
    const y = Math.random() * (h - size);
    ball.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;background:radial-gradient(circle at 35% 35%, ${colors[Math.floor(Math.random()*colors.length)]}, rgba(0,0,0,0.5));`;
    ball.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    ball.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!gameActive) return;
      score++;
      if (scoreEl) scoreEl.textContent = score;
      // Ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.4);width:${getBallSize().size}px;height:${getBallSize().size}px;left:${ball.style.left};top:${ball.style.top};animation:rippleFade 0.4s ease forwards;pointer-events:none;`;
      arena.appendChild(ripple);
      setTimeout(() => ripple.remove(), 400);
      spawnBall();
    });
    arena.appendChild(ball);
  }

  function startGame() {
    score = 0; timeLeft = 30; gameActive = true;
    if (scoreEl) scoreEl.textContent = 0;
    if (startBtn) startBtn.textContent = '🎮 Playing...';
    startBtn.disabled = true;
    spawnBall();
    // Timer
    timer = setInterval(() => {
      timeLeft--;
      const pct = (timeLeft / 30) * 100;
      if (timerBar) { timerBar.style.width = pct + '%'; timerBar.style.background = pct > 50 ? 'linear-gradient(90deg,#43E97B,#FFD93D)' : pct > 20 ? 'linear-gradient(90deg,#FFD93D,#FF9A3C)' : 'linear-gradient(90deg,#FF6584,#FF4444)'; }
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameActive = false;
        if (ball) ball.remove(); ball = null;
        if (startBtn) { startBtn.textContent = '🔄 Play Again!'; startBtn.disabled = false; }
        if (score > best) { best = score; if (bestEl) bestEl.textContent = best; }
        if (score >= 10) showWinOverlay('🎯', 'Ball Master!', `You clicked ${score} balls! New record: ${Math.max(score, best)}!`);
        else showToast(`⏱️ Time's up! You scored ${score} points!`);
      }
    }, 1000);
  }

  if (startBtn) startBtn.addEventListener('click', () => { if (!gameActive) startGame(); });

  // Inject ripple style
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleFade{from{opacity:0.8;transform:scale(1);}to{opacity:0;transform:scale(2);}}';
  document.head.appendChild(style);
})();

// ============================================
// ============================================
// GAME 6: SIMPLE MATH QUIZ
// ============================================
// ============================================
(function MathQuiz() {
  let score = 0, total = 0, questionNum = 0, totalQuestions = 10, correctAnswer;
  let answered = false;

  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');
  const scoreEl = document.getElementById('quizScore');
  const progressEl = document.getElementById('quizProgress');

  function generateQuestion() {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;
    if (op === '+') { a = Math.floor(Math.random() * 20) + 1; b = Math.floor(Math.random() * 20) + 1; correctAnswer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * 20) + 10; b = Math.floor(Math.random() * a) + 1; correctAnswer = a - b; }
    else { a = Math.floor(Math.random() * 9) + 2; b = Math.floor(Math.random() * 9) + 2; correctAnswer = a * b; }
    if (questionEl) questionEl.textContent = `${a} ${op} ${b} = ?`;

    // Generate wrong answers
    const wrongSet = new Set([correctAnswer]);
    while (wrongSet.size < 4) {
      const delta = Math.floor(Math.random() * 10) + 1;
      const candidate = correctAnswer + (Math.random() > 0.5 ? delta : -delta);
      if (candidate >= 0) wrongSet.add(candidate);
    }
    const allOptions = shuffle([...wrongSet]);

    if (optionsEl) {
      optionsEl.innerHTML = '';
      allOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => checkAnswer(opt, btn));
        optionsEl.appendChild(btn);
      });
    }
    if (feedbackEl) { feedbackEl.textContent = ''; feedbackEl.style.color = ''; }
    if (progressEl) progressEl.textContent = `Question ${questionNum + 1} of ${totalQuestions}`;
    answered = false;
  }

  function shuffle(arr) {
    for (let i = arr.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }

  function checkAnswer(val, btn) {
    if (answered) return;
    answered = true; total++;
    const opts = optionsEl.querySelectorAll('.quiz-opt');
    opts.forEach(o => { o.disabled = true; if (parseInt(o.textContent) === correctAnswer) o.classList.add('correct'); });

    if (val === correctAnswer) {
      btn.classList.add('correct');
      score++;
      if (scoreEl) scoreEl.textContent = score;
      if (feedbackEl) { feedbackEl.textContent = '✅ Correct! Well done! 🌟'; feedbackEl.style.color = '#43E97B'; }
    } else {
      btn.classList.add('wrong');
      if (feedbackEl) { feedbackEl.textContent = `❌ Wrong! Answer was ${correctAnswer}`; feedbackEl.style.color = '#FF6584'; }
    }
    questionNum++;
    if (questionNum >= totalQuestions) {
      setTimeout(() => {
        if (score >= 8) showWinOverlay('🧠', 'Math Genius!', `You scored ${score}/${totalQuestions}! Outstanding!`);
        else if (score >= 5) showToast(`Quiz done! You scored ${score}/${totalQuestions}! Good job! 👏`, 3500);
        else showToast(`Quiz done! You scored ${score}/${totalQuestions}. Keep practicing! 💪`, 3500);
        resetQuiz();
      }, 1500);
    } else {
      setTimeout(generateQuestion, 1400);
    }
  }

  function resetQuiz() {
    score = 0; total = 0; questionNum = 0;
    if (scoreEl) scoreEl.textContent = 0;
    generateQuestion();
  }

  document.getElementById('quizReset')?.addEventListener('click', resetQuiz);
  generateQuestion();
})();

// ============================================
// CONTACT FORM SUBMIT
// ============================================
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.querySelector('[name="name"]')?.value;
  showWinOverlay('💌', 'Message Sent!', `Thank you, ${name}! We'll get back to you soon! 😊`);
  e.target.reset();
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================
// STAR PARTICLES in Hero Section
// ============================================
function createStars() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(255,255,255,${0.3+Math.random()*0.7});
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation:starTwinkle ${2+Math.random()*3}s ease-in-out infinite;
      animation-delay:${Math.random()*3}s;
      pointer-events:none;z-index:0;
    `;
    hero.appendChild(star);
  }
  const style = document.createElement('style');
  style.textContent = '@keyframes starTwinkle{0%,100%{opacity:0.2;transform:scale(1);}50%{opacity:1;transform:scale(1.5);}}';
  document.head.appendChild(style);
}
createStars();

// ============================================
// GAME CARD Color Gradients (Applied on load)
// ============================================
document.querySelectorAll('.game-icon').forEach((icon, i) => {
  const gradients = [
    'linear-gradient(135deg,#FF6584,#FF9A3C)',
    'linear-gradient(135deg,#6C63FF,#4FC3F7)',
    'linear-gradient(135deg,#43E97B,#38F9D7)',
    'linear-gradient(135deg,#FFD93D,#FF9A3C)',
    'linear-gradient(135deg,#CE93D8,#6C63FF)',
    'linear-gradient(135deg,#FF6584,#CE93D8)',
  ];
  icon.style.background = gradients[i % gradients.length];
});

console.log('%c🎮 Pragati Kids Games', 'font-size:20px;color:#6C63FF;font-weight:bold;');
console.log('%cCreated with ❤️ by Pragati Sahayak', 'font-size:14px;color:#FF6584;');
