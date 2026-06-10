// Importa a classe ScoreBoard do arquivo scoreBoard.js
// O require é o sistema de módulos do Node.js
const { ScoreBoard } = require('./scoreBoard');


// Classe responsável por representar uma partida (Match)
class Match {

  // Método executado automaticamente quando fazemos:
  // const partida = new Match()
  constructor() {

    // Cria uma nova instância do placar
    // Cada partida possui seu próprio placar
    this.scoreBoard = new ScoreBoard();

    // Cria o objeto de controle do tempo da partida
    this.timer = this.createTimer();

    // Armazena o vencedor da partida
    // Começa como null porque ainda não existe vencedor
    this.winner = null;
  }

  // Método responsável por criar e retornar
  // um objeto contendo todas as informações do cronômetro
  createTimer() {

    return {

      // Duração total da partida em segundos
      // 5 * 60 = 300 segundos = 5 minutos
      durationSeconds: 5 * 60,

      // Quantos segundos faltam para acabar a partida
      // null significa que ainda não foi iniciado
      remainingSeconds: null,

      // Booleano que indica se o cronômetro está rodando
      // false = parado
      // true = em execução
      isRunning: false,

      // Armazena o timestamp de início da partida
      // Normalmente recebe Date.now()
      // Exemplo: 1749483123123
      startedAt: null,

      // Armazena o timestamp de término da partida
      // Também costuma receber Date.now()
      endedAt: null,
    };
  }

  // Método responsável por finalizar a partida
  // Parâmetros:
  // now -> horário atual (timestamp)
  // getWinner -> vencedor calculado em outro lugar do sistema
  finish(now, getWinner) {

    // Marca que o cronômetro não está mais rodando
    this.timer.isRunning = false;

    // Salva o momento exato em que a partida terminou
    this.timer.endedAt = now;

    // Armazena quem venceu a partida
    this.winner = getWinner();
  }

  // Método responsável por reiniciar o cronômetro
  resetTimer() {

    // Cria um novo objeto timer "zerado"
    // substituindo o antigo completamente
    this.timer = this.createTimer();
  }
}


// Exporta a classe Match
// Isso permite utilizar em outros arquivos:
//
// const { Match } = require('./match');
//
module.exports = { Match };
