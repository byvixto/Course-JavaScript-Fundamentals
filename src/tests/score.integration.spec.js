const request = require('supertest');
const app = require('../express');
const scoreRoutes = require('../routes/score');

describe('score API', () => {
  beforeEach(() => {
    console.log('para cada etapa execute');
    scoreRoutes.resetInternalScoreBoard();
  });
  it('deve retornar o placar inicial', async () => {
    let response = await request(app)
      .get('/api/score/buscar')
      .send({ team: 'home' });
    expect(response.status).toBe(200);
    expect(response.body.homeScore).toBe(0);
    expect(response.body.awayScore).toBe(0);

    console.log(response.body);
    //===========================================

    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'home' });
    }
    let response2 = await request(app)
      .get('/api/score/buscar')
      .send({ team: 'home' });
    expect(response2.status).toBe(200);
    expect(response2.body.homeScore).toBe(2);
    expect(response2.body.awayScore).toBe(0);

    console.log(response2.body);
  });

  it('deve remover ponto do time da casa', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'home' });
    }
    const response = await request(app)
      .post('/api/score/remove')
      .send({ team: 'home' });
    expect(response.status).toBe(200);
    expect(response.body.homeScore).toBe(1);
    expect(response.body.awayScore).toBe(0);

    console.log(response.body);
  });

  it('deve remover ponto do time visitante', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app).post('/api/score/point').send({ team: 'away' });
    }
    const response = await request(app)
      .post('/api/score/remove')
      .send({ team: 'away' });
    expect(response.status).toBe(200);
    expect(response.body.homeScore).toBe(0);
    expect(response.body.awayScore).toBe(1);

    console.log(response.body);
  });
});
