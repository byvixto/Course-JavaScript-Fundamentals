/*
 
Importa o framework Express.
O Express é usado para criar servidores HTTP e definir rotas da aplicação.*/
const express = require("express");

/*
 
Cria um objeto de rotas do Express.
Esse router permite agrupar endpoints relacionados,
neste caso, endpoints do placar.*/
const router = express.Router();

/*
 
Objeto que representa o placar atual da partida.*
Propriedades:
homeTeam: nome do time da casa
awayTeam: nome do time visitante
homeScore: pontuação do time da casa
awayScore: pontuação do time visitante
*
Esse objeto fica em memória enquanto a aplicação estiver rodando.
Ou seja: se o servidor reiniciar, os valores voltam ao estado inicial.*/
let scoreBoard = {
    homeTeam: 'Team a',
    awayTeam: 'Team b',
    homeScore: 0,
    awayScore: 0
};

/*
 
Rota GET /buscar*
Objetivo:
Retornar o placar atual.*
Parâmetros:
req: objeto da requisição HTTP recebida do cliente
res: objeto da resposta HTTP enviada ao cliente
*
Funcionamento:
Quando alguém faz uma requisição GET para /buscar,
o servidor responde com o objeto scoreBoard em formato JSON.*
Exemplo de resposta:
{
"homeTeam": "Team a",
"awayTeam": "Team b",
"homeScore": 0,
"awayScore": 0
}*/
router.get('/buscar', (req, res) => {
    res.json(scoreBoard);
});
/*
 
Rota POST /reset*
Objetivo:
Alterar parcialmente o placar.*
Parâmetros:
req: objeto da requisição HTTP
res: objeto da resposta HTTP
*
Funcionamento:
Quando alguém faz uma requisição POST para /reset,
o código altera a pontuação do time da casa (homeScore)
para 1000.
Depois retorna o objeto scoreBoard atualizado em JSON.
*
Observação importante:
Apesar do nome da rota ser "reset", ela não zera o placar.
Ela apenas define homeScore = 1000.*
Se a intenção for realmente resetar o placar,
o mais correto seria:
homeScore = 0
awayScore = 0
*/
router.post('/teams', (req, res) => {
    const { homeTeam, awayTeam } = req.body;
    if (homeTeam) {
        scoreBoard.homeTeam = homeTeam;
    }
    if (awayTeam) {
        scoreBoard.awayTeam = awayTeam;
    }
    res.json(scoreBoard);
});






router.post('/reset', (req, res) => {
    scoreBoard.homeScore = 0;
    scoreBoard.awayScore = 0
    res.json(scoreBoard);
});
router.post('/point', (req, res) => {
    res.json(scoreBoard);
    const { team } = req.body;
    








    
                error: 'team deve ser home ou away'
            }
        )
    }
    res.status(200).json(scoreBoard);
});
/*
 
Exporta o router para que ele possa ser usado em outro arquivo,
normalmente no arquivo principal do servidor, como app.js ou server.js.*
Exemplo de uso:
const scoreRoutes = require('./routes/score');
app.use('/api/score', scoreRoutes);*/
module.exports = router;