const { Match } = require('./match');
class MatchService {
  constructor() {}
  resetState() {
    this.match = new Match();
    this.match.timer = this.match.createTimer();
  }
  addPoint(team) {
    this.match.scoreBoard.addPoint(team);
    return {
      status: 200,
    };
  }
}

module.exports = MatchService;
