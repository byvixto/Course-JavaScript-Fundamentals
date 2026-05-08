const { ScoreBoard } = require('./scoreBoard');
class Match {
  constructor() {
    this.scoreBoard = new ScoreBoard();
    this.timer = this.createTimer();
    this.winner = null;
  }

  createTimer() {
    return {
      durationSeconds: 5 * 60,
      remainingSeconds: null,
      isRunning: false,
      startedAt: null,
      endedAt: null,
    };
  }
  resetTimer() {
    this.timer = this.createTimer();
  }
  toJSON() {
    return {
      scoreBoard: this.scoreBoard.toJSON(),
      timer: {
        durationSeconds: this.timer.durationSeconds,
        remainingSeconds: this.timer.remainingSeconds,
        isRunning: this.timer.isRunning,
        startedAt: this.timer.startedAt,
        endedAt: this.timer.endedAt,
      },
    };
  }
}
module.exports = { Match };
