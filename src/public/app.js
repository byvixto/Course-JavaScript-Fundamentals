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

async function fetchScoreboard() {
  try {
    const response = await fetch('http://localhost:3000/api/score/buscar');

    console.log('status:', response.status);
    console.log('content-type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('resposta bruta:', text);

    const data = JSON.parse(text);

    document.getElementById('homeScore').textContent = data.homeScore;
    document.getElementById('awayScore').textContent = data.awayScore;
  } catch (error) {
    console.error('erro ao buscar placar:', error);
  }
}

fetchScoreboard();
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
  homeTeamName.textContent = data.homeTeam;
  awayTeamName.textContent = data.awayTeam;
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
  if (team === 'home') {
    if (action === 'add') {
      addPoint(team);
      console.log("adicionando pontos para o time home")
    }
    if (action === 'remove') {
      removePoint(team);
      console.log("removendo pontos para o time home")
    }
  } else if (team === 'away') {
    if (action === 'add') {
      addPoint(team);
       console.log("adicionando pontos para o time away")
    }
    if (action === 'remove') {
      removePoint(team);
      console.log("removendo pontos para o time away")

    }
  }
}

homeAdd.addEventListener('click', () => updatePoint('home', 'add'));
homeRemove.addEventListener('click', () => removePoint('home', 'remove'));

awayAdd.addEventListener('click', () => updatePoint('away', 'add'));
awayRemove.addEventListener('click', () => removePoint('away', 'remove'));
