const { MatchValidator } = require('../validator/matchValidator');
const { MatchTimerService } = require('./matchTimerService');
const HttpStatus = require('http-status-codes');
const { Match } = require('../model/match');

class MatchService {
  constructor() {
    this.resetState();
  }

  resetState() {
    this.match = new Match();
    this.match.timer = this.match.createTimer(this.durationSeconds);
    this.matchTimerService = new MatchTimerService(this.match, () =>
      this.getWinner(),
    );
  }


  getScoreBoard() {
    this.matchTimerService.syncTimerState();

    return {
      success: true,
      message: 'placar da partida',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  addPoint(team) {
    this.matchTimerService.syncTimerState();

    if (this.match.timer.endedAt) {
      return {
        valid: false,
        error: 'A partida terminou. Resete o placar para iniciar uma nova partida.',
      };
    }


    this.match.scoreBoard.addPoint(team);

    return {
      success: true,
      message: 'Ponto adicionado com sucesso.',
      status: 200,
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  updateTeams(homeTeam, awayTeam) {
    console.log('Atualizando times:', { homeTeam, awayTeam });
    const validation =
      new MatchValidator().validateTeamsUpdate(homeTeam, awayTeam);

    if (!validation.valid) {
      return {
        success: false,
        status: 400,
        error: validation.error,
      };
    }

    //this.matchTimerService.syncTimerState();
    console.log('Estado do timer antes de atualizar os times:', this.match.timer);
    if (this.match.timer.endedAt) {
      return {
        success: false,
        status: 400,
        error: 'A partida foi encerrada.',
      };
    }

    this.match.scoreBoard.updateTeams(homeTeam, awayTeam);

    return {
      success: true,
      status: 200,
      message: 'Nomes dos times atualizados com sucesso.',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  removePoint(team) {
    this.matchTimerService.syncTimerState();
    if (this.match.timer.endedAt) {
      return {
        valid: false,
        error: 'A partida terminou. Resete o placar para iniciar uma nova partida.',
      };
    }
    this.match.scoreBoard.removePoint(team);
    return {
      success: true,
      message: 'Ponto removido com sucesso.',
      status: 200,
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  };

  resetScoreBoard() {
    this.resetState();

    return {
      success: true,
      status: 200,
      message: 'Placar reiniciado com sucesso.',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  startTimer() {
    this.matchTimerService.syncTimerState();
    const timer = this.match.timer;

    if (timer.endedAt) {
      return {
        success: false,
        status: 400,
        error: 'A partida terminou. Resete o placar para iniciar uma nova partida.',
      };
    }

    if (!timer.isRunning) {
      if (timer.remainingSeconds !== null) {
        timer.durationSeconds = timer.remainingSeconds;
      }
      timer.startedAt = Date.now();
      timer.isRunning = true;
    }

    return {
      success: true,
      status: 200,
      message: 'Cronômetro iniciado.',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  pauseTimer() {
    this.matchTimerService.syncTimerState();
    const timer = this.match.timer;

    if (timer.isRunning) {
      timer.isRunning = false;
      timer.startedAt = null;
    }

    return {
      success: true,
      status: 200,
      message: 'Cronômetro pausado.',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  resetTimer() {
    this.match.resetTimer();
    this.match.winner = null;

    return {
      success: true,
      status: 200,
      message: 'Cronômetro reiniciado.',
      scoreBoard: this.match.scoreBoard,
      timer: this.match.timer,
      winner: this.match.winner,
    };
  }

  getWinner() {
    if (this.match.scoreBoard.homeScore > this.match.scoreBoard.awayScore) {
      return {
        team: 'home',
        name: this.match.scoreBoard.homeTeam,
        label: 'Vitoria do time da casa',
      };
    }

    if (this.match.scoreBoard.awayScore > this.match.scoreBoard.homeScore) {
      return {
        team: 'away',
        name: this.match.scoreBoard.awayTeam,
        label: 'Vitoria do time visitante',
      };
    }

    return {
      team: 'draw',
      name: 'Empate',
      label: 'Partida empatada',
    };
  }
}
module.exports = {
  MatchService,
};






