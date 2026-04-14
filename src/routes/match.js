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
}
