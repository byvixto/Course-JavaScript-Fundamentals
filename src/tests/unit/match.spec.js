const { Match } = require('../../model/match');
const { ScoreBoard } = require('../../model/scoreBoard');

describe('Match', () => {
  it('deve criar uma partida com placar, timer inicial e sem vencedor', () => {
    const match = new Match();

    expect(match.scoreBoard).toBeInstanceOf(ScoreBoard);
    expect(match.timer).toEqual({
      durationSeconds: 300,
      remainingSeconds: null,
      isRunning: false,
      startedAt: null,
      endedAt: null,
    });
    expect(match.winner).toBeNull();
  });

  it('deve retornar um novo objeto de timer com os valores padrao', () => {
    const match = new Match();
    const timer = match.createTimer();

    expect(timer).toEqual({
      durationSeconds: 300,
      remainingSeconds: null,
      isRunning: false,
      startedAt: null,
      endedAt: null,
    });
    expect(timer).not.toBe(match.timer);
  });

  it('deve finalizar a partida e salvar o vencedor retornado por getWinner', () => {
    const match = new Match();
    const getWinner = jest.fn(() => 'home');
    const now = 123456789;

    match.timer.isRunning = true;
    match.finish(now, getWinner);

    expect(match.timer.isRunning).toBe(false);
    expect(match.timer.endedAt).toBe(now);
    expect(match.winner).toBe('home');
    expect(getWinner).toHaveBeenCalledTimes(1);
  });

  it('deve resetar o timer para o estado inicial', () => {
    const match = new Match();

    match.timer.remainingSeconds = 120;
    match.timer.isRunning = true;
    match.timer.startedAt = 999;
    match.timer.endedAt = 1111;

    const previousTimer = match.timer;

    match.resetTimer();

    expect(match.timer).toEqual({
      durationSeconds: 300,
      remainingSeconds: null,
      isRunning: false,
      startedAt: null,
      endedAt: null,
    });
    expect(match.timer).not.toBe(previousTimer);
  });
});
