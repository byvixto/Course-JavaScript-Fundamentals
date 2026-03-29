const homeScore = document.getElementById('homeScore');
const resetBtn = document.getElementById('resetBtn');
const salvarTeamBtn = document.getElementById('salvarTeamBtn');
const homeTeamInput = document.getElementById('homeTeamInput');
const awayTeamInput = document.getElementById('awayTeamInput');
//atribuir o nome
const homeTeamName = document.getElementById('homeTeamName');
const awayTeamName = document.getElementById('awayTeamName');

async function fetchScoreboard() {
  try {
    const response = await fetch('http://localhost:3000/api/score/buscar');

    console.log('status:', response.status);
    console.log('content-type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('resposta bruta:', text);

    const data = JSON.parse(text);

    document.getElementById('homeScore').textContent = data.homeScore;
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
