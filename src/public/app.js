const homeScore = document.getElementById('homeScore');
const resetBtn = document.getElementById("resetBtn");

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
        method: 'POST'
    });
    const data = await response.json();
    console.log(data);
    fetchScoreboard();

}
resetBtn.addEventListener('click', resetScore);

fetchScoreBoard();