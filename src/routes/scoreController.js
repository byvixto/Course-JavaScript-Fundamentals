const express = require('express');

class ScoreController {
  constructor() {
    this.router = express.Router();
  }

  registerRoutes() {
    this.router.post('/point', this.addPoint.bind(this));
    this.router.get('/buscar', this.getScoreBoard.bind(this));
    this.router.post('/teams', this.updateTeams.bind(this));
    this.router.post('/reset', this.resetScoreBoard.bind(this));
    this.router.post('/point', this.addPoint.bind(this));
    this.router.post('/remove', this.removePoint.bind(this));
    this.router.post('/timer/start', this.startTimer.bind(this));
    this.router.post('/timer/pause', this.pauseTimer.bind(this));
    this.router.post('/timer/reset', this.resetTimer.bind(this));
  }
  sendResult(res, result) {
    if (result.payload) {
      return res.status(result.status).json(result.payload);
    }

    return res.status(result.status).json({
      success: false,
      message: result.message,
    });
  }

  getScoreBoard(req, res) {
    res.status(200).json(this.matchService.getScoreBoard());
  }

  updateTeams(req, res) {
    return this.sendResult(
      res,
      this.matchService.updateTeams(req.body.homeTeam, req.body.awayTeam)
    );
  }

  resetScoreBoard(req, res) {
    return this.sendResult(res, this.matchService.resetScoreBoard());
  }

  addPoint(req, res) {
    return this.sendResult(res, this.matchService.addPoint(req.body.team));
  }

  removePoint(req, res) {
    return this.sendResult(res, this.matchService.removePoint(req.body.team));
  }

  startTimer(req, res) {
    return this.sendResult(res, this.matchService.startTimer());
  }

  pauseTimer(req, res) {
    return this.sendResult(res, this.matchService.pauseTimer());
  }

  resetTimer(req, res) {
    return this.sendResult(res, this.matchService.resetTimer());
  }
}

const scoreController = new ScoreController();

module.exports = scoreController.router;
module.exports.resetInternalScoreBoard = () =>
  scoreController.matchService.resetState();
module.exports.ScoreController = ScoreController;
