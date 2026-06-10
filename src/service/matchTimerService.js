class MatchTimerService {
  constructor(match, getWinner) {
    this.match = match;
    this.getWinner = getWinner;
  }

  syncTimerState(now = Date.now()) {

    const timer = this.match.timer;

    if (!timer.isRunning || !timer.startedAt) {
      return;
    }

    const elapsedSeconds = Math.floor(
      (now - timer.startedAt) / 1000,
    );

    timer.remainingSeconds = Math.max(
      0,
      timer.durationSeconds - elapsedSeconds,
    );

    if (timer.remainingSeconds === 0) {
      this.finishMatch(now);
    }
  }

  finishMatch(now = Date.now()) {
    this.match.finish(now, this.getWinner);
  }
}

module.exports = {
  MatchTimerService,
};
