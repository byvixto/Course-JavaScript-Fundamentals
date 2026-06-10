const homeScore = document.getElementById('homeScore');
const resetBtn = document.getElementById('resetBtn');
const salvarTeamBtn = document.getElementById('salvarTeamBtn');
const homeTeamInput = document.getElementById('homeTeamInput');
const awayTeamInput = document.getElementById('awayTeamInput');
//atribuir o nome
const homeTeamName = document.getElementById('homeTeamName');
const awayTeamName = document.getElementById('awayTeamName');
//declarar 4 botões
const homeAdd = document.getElementById('homeAdd');
const homeRemove = document.getElementById('homeRemove');
const awayAdd = document.getElementById('awayAdd');
const awayRemove = document.getElementById('awayRemove');
//cronômetro
const timerDisplay = document.getElementById('timerDisplay');
const winnerBanner = document.getElementById('winnerBanner');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerPauseBtn = document.getElementById('timerPauseBtn');
const timerResetBtn = document.getElementById('timerResetBtn');

function formatTime(totalSeconds) {
  const seconds = Math.max(0, totalSeconds ?? 0);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateTimer(timer, winner) {
  const seconds = timer.remainingSeconds ?? timer.durationSeconds;
  timerDisplay.textContent = formatTime(seconds);

  timerStartBtn.disabled = timer.isRunning || Boolean(timer.endedAt);
  timerPauseBtn.disabled = !timer.isRunning;

  if (timer.endedAt && winner) {
    winnerBanner.textContent = winner.label;
  } else {
    winnerBanner.textContent = '';
  }
}

async function fetchScoreboard() {
  try {
    const response = await fetch('http://localhost:3000/api/score/scoreboard');

    console.log('status:', response.status);
    console.log('content-type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('resposta bruta:', text);

    const data = JSON.parse(text);

    document.getElementById('homeScore').textContent = data.scoreBoard.homeScore;
    document.getElementById('awayScore').textContent = data.scoreBoard.awayScore;
    document.getElementById('homeTeamName').textContent = data.scoreBoard.homeTeam;
    document.getElementById('awayTeamName').textContent = data.scoreBoard.awayTeam;
    updateTimer(data.timer, data.winner);
  } catch (error) {
    console.error('erro ao buscar placar:', error);
  }
}

fetchScoreboard();
setInterval(fetchScoreboard, 1000);

async function timerAction(action) {
  const response = await fetch(`/api/score/timer/${action}`, {
    method: 'POST',
  });
  const data = await response.json();
  console.log(data);
  fetchScoreboard();
}

timerStartBtn.addEventListener('click', () => timerAction('start'));
timerPauseBtn.addEventListener('click', () => timerAction('pause'));
timerResetBtn.addEventListener('click', () => timerAction('reset'));

async function resetScore() {
  const response = await fetch('/api/score/reset', {
    method: 'POST',
  });
  const data = await response.json();
  console.log(data);
  fetchScoreboard();
}

resetBtn.addEventListener('click', resetScore);

async function salvarTeam() {
  console.log('funcionando');

  const homeTeam = homeTeamInput.value.trim();
  const awayTeam = awayTeamInput.value.trim();

  console.log(homeTeam);
  console.log(awayTeam);
  if (!homeTeam || !awayTeam) {
    alert('preencha o nome dos dois times');
    return;
  }
  const response = await fetch('/api/score/teams', {
    method: 'POST',
    body: JSON.stringify({
      homeTeam: homeTeam,
      awayTeam: awayTeam,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);
  homeTeamName.textContent = data.scoreBoard.homeTeam;
  awayTeamName.textContent = data.scoreBoard.awayTeam;
}

salvarTeamBtn.addEventListener('click', salvarTeam);

async function addPoint(team) {
  const response = await fetch('/api/score/point', {
    method: 'POST',
    body: JSON.stringify({
      team: team, // 'home'||'away'
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  console.log(data);

  fetchScoreboard();
}

async function removePoint(team) {
  const response = await fetch('/api/score/remove', {
    method: 'POST',
    body: JSON.stringify({
      team: team,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log(data);

  fetchScoreboard();
}

async function updatePoint(team, action) {
  if (action === 'add') {
    addPoint(team);
    console.log('adicionando pontos para o time home');
  }
  if (action === 'remove') {
    removePoint(team);
    console.log('removendo pontos para o time home');
  }
}

homeAdd.addEventListener('click', () => updatePoint('home', 'add'));
homeRemove.addEventListener('click', () => removePoint('home', 'remove'));

awayAdd.addEventListener('click', () => updatePoint('away', 'add'));
awayRemove.addEventListener('click', () => removePoint('away', 'remove'));
