class MatchValidator {
  validateTeamsUpdate(homeTeam, awayTeam) {
    if (!homeTeam && !awayTeam) {
      return {
        valid: false,
        error: 'Informe ao menos um nome de time valido.',
      };
    }

    return { valid: true };
  }
}

module.exports = {
  MatchValidator,
};