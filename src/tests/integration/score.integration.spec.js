const request = require('supertest');
const app = require('../../express');
const scoreController = require('../../controller/scoreController');

describe('score API', () => {
  beforeEach(() => {
    scoreController.resetInternalScoreBoard();
  });

  it('deve retornar o placar inicial', async () => {
    const response = await request(app).get('/api/score/scoreboard');
    expect(response.status).toBe(200);
    expect(response.body.scoreBoard.homeScore).toBe(0);
    expect(response.body.scoreBoard.awayScore).toBe(0);

    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'home' });
    }

    const response2 = await request(app).get('/api/score/scoreboard');
    expect(response2.status).toBe(200);
    expect(response2.body.scoreBoard.homeScore).toBe(2);
    expect(response2.body.scoreBoard.awayScore).toBe(0);
  });

  it('deve remover ponto do time da casa', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'home' });
    }
    const response = await request(app)
      .post('/api/score/remove')
      .send({ team: 'home' });
    expect(response.status).toBe(200);
    expect(response.body.scoreBoard.homeScore).toBe(1);
    expect(response.body.scoreBoard.awayScore).toBe(0);
  });

  it('deve remover ponto do time visitante', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'away' });
    }
    const response = await request(app)
      .post('/api/score/remove')
      .send({ team: 'away' });
    expect(response.status).toBe(200);
    expect(response.body.scoreBoard.homeScore).toBe(0);
    expect(response.body.scoreBoard.awayScore).toBe(1);
  });
});
