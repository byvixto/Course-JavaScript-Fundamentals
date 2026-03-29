const express = require('express');

const router = express.Router();

let scoreBoard = createInitialScoreBoard();

function createInitialScoreBoard(){
    return {
    
  homeTeam: 'Team a',
  awayTeam: 'Team b',
  homeScore: 0,
  awayScore: 0,
};
}
function resetInternalScoreBoard(){
    scoreBoard = createInitialScoreBoard();
}
router.get('/buscar', (req, res) => {
  res.status(200).json(scoreBoard);
});

router.post('/teams', (req, res) => {
  const { homeTeam, awayTeam } = req.body;

  if (homeTeam) {
    scoreBoard.homeTeam = " time "+homeTeam;
  }

  if (awayTeam) {
    scoreBoard.awayTeam = " time "+awayTeam;
  }

  res.status(200).json(scoreBoard);
});

router.post('/reset', (req, res) => {
  scoreBoard.homeScore = 0;
  scoreBoard.awayScore = 0;

  res.status(200).json(scoreBoard);
});

router.post('/point', (req, res) => {
  const { team } = req.body;

  if (team === 'home') {
    scoreBoard.homeScore += 1;
  } else if (team === 'away') {
    scoreBoard.awayScore += 1;
  } else {
    return res.status(400).json({
      error: 'team deve ser home ou away',
    });
  }

  res.status(200).json(scoreBoard);
});

router.post('/remove', (req, res) => {
  const { team } = req.body;
  if (team === 'home') {
    scoreBoard.homeScore = Math.max(0, scoreBoard.homeScore - 1);
  } else if (team === 'away') {
    scoreBoard.awayScore = Math.max(0, scoreBoard.awayScore - 1);
  } else {
    return res.status(400).json({
      error: 'team deve ser home ou away',
    });
  }
  return res.status(200).json(scoreBoard);
});

module.exports = router;

module.exports.resetInternalScoreBoard= resetInternalScoreBoard;
