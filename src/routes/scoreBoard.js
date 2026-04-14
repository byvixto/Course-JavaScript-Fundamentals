class ScoreBoard {
  constructor(
    homeTeam = 'time Da Casa',
    awayTeam = 'time Visitante',
    homeScore = 0,
    awayScore = 0
  ) 
  {
    this.homeTeam = homeTeam;
    this.homeScore = homeScore;
    this.awayTeam = awayTeam;
    this.awayScore = awayScore;
  }

  addPoint(team) {
    if (team === 'home') {
      this.homeScore += 1;
    } else if (team === 'away') {
      this.awayScore += 1;
    }
  }

  removePoint(team) {
    if (team === 'home') {
      this.homeScore = Math.max(0, this.homeScore - 1);
    } else if (team === 'away') {
      this.awayScore = Math.max(0, this.awayScore - 1);
    }
  }
}
module.exports = ScoreBoard