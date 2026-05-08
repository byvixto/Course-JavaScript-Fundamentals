const { Match } = require('../model/match');
class MatchService {
  constructor() {
    this.resetState();
  }
  resetState() {
    this.match = new Match();
    this.match.timer = this.match.createTimer();
  }
  addPoint(team) {
    const validation = this.validateTeam(team);
    const activeMatchValidation = this.ensureMatchIsActive();

    if (!validation.valid) {
      return {
        success: false,
        status: 400,
        message: validation.error,
      };
    }
    if (!activeMatchValidation.valid) {
      return {
        success: false,
        status: 400,
        message: activeMatchValidation.error,
      };
    }

    this.match.scoreBoard.addPoint(team);
    return {
      status: 200,
      payload: this.getSnapshot('ponto adicionado com sucesso'),
    };
  }
  getSnapshot(message) {
    const snapshot = this.match.toJSON();
    return {
      success: true,
      message,
      scoreBoard: snapshot.scoreBoard,
      timer: snapshot.timer,
      winner: snapshot.winner,
    };
  }
  validateTeam(team) {
    if (team != 'home' && team != 'away') {
      return {
        valid: false,
        error: 'team deve ser home ou away',
      };
    }
    return {
      valid: true,
    };
  }
  ensureMatchIsActive() {
    if (this.match.timer.endedAt) {
      return {
        valid: false,
        error:
          'a partida terminou. Resete o placar para iniciar uma nova partida!',
      };
    }
    return {
      valid: true,
    };
  }
}

module.exports = { MatchService };
