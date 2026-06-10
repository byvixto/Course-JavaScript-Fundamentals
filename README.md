# Curso Mentoria 2026 — Placar de Partida

Aplicação Node.js/Express que implementa um placar de partida com cronômetro,
controle de pontuação dos times e uma interface web simples para acompanhar o jogo.

## Tecnologias

- [Node.js](https://nodejs.org/) (CommonJS)
- [Express 5](https://expressjs.com/)
- [http-status-codes](https://www.npmjs.com/package/http-status-codes)
- [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) (testes)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) (qualidade e formatação de código)
- [nodemon](https://nodemon.io/) (recarregamento automático em desenvolvimento)

## Estrutura do projeto

```
src/
├── server.js                  # Ponto de entrada: inicia o servidor Express na porta 3000
├── express.js                 # Configuração da aplicação Express (middlewares e rotas)
├── controller/
│   └── scoreController.js     # Rotas da API /api/score e orquestração das requisições
├── service/
│   ├── matchService.js        # Regras de negócio da partida (placar, times, vencedor)
│   └── matchTimerService.js    # Sincronização e finalização do cronômetro da partida
├── model/
│   ├── match.js                # Entidade Match (placar, cronômetro, vencedor)
│   ├── score.js                 # Router legado de placar (mantido para referência)
│   └── scoreBoard.js            # Entidade ScoreBoard (times e pontuação)
├── validator/
│   └── matchValidator.js       # Validações de entrada (ex.: atualização de times)
├── public/
│   ├── index.html               # Interface web do placar
│   ├── app.js                   # Lógica do front-end (consome a API)
│   └── style.css                # Estilos da interface
└── tests/
    └── score.integration.spec.js # Testes de integração da API
```

## Como executar

Instale as dependências:

```bash
npm install
```

### Modo desenvolvimento (com recarregamento automático)

```bash
npm run dev
```

Usa o `nodemon` para reiniciar o servidor automaticamente sempre que um arquivo
dentro de `src/` (`.js`, `.json`, `.html` ou `.css`) for alterado.

### Modo produção

```bash
npm start
```

O servidor sobe em `http://localhost:3000`. A interface web fica disponível na
raiz (`/`) e a API em `/api/score`.

## Scripts disponíveis

| Script           | Descrição                                          |
| ---------------- | --------------------------------------------------- |
| `npm start`        | Inicia o servidor com Node.js                       |
| `npm run dev`      | Inicia o servidor com nodemon (auto-reload)          |
| `npm test`         | Executa os testes com Jest (`--runInBand`)           |
| `npm run lint`     | Executa o ESLint                                     |
| `npm run lint:fix` | Executa o ESLint corrigindo problemas automaticamente |
| `npm run format`   | Formata o código com Prettier                        |
| `npm run format:check` | Verifica a formatação sem alterar arquivos       |

## API — `/api/score`

| Método | Rota             | Descrição                                          |
| ------ | ---------------- | --------------------------------------------------- |
| GET    | `/scoreboard`     | Retorna o placar atual, o cronômetro e o vencedor   |
| POST   | `/teams`          | Atualiza os nomes dos times (`homeTeam`, `awayTeam`) |
| POST   | `/point`          | Adiciona um ponto ao time informado (`team`: `home`/`away`) |
| POST   | `/remove`         | Remove um ponto do time informado (`team`: `home`/`away`) |
| POST   | `/reset`          | Reinicia o placar e a partida                        |
| POST   | `/timer/start`    | Inicia/retoma o cronômetro da partida                |
| POST   | `/timer/pause`    | Pausa o cronômetro da partida                        |
| POST   | `/timer/reset`    | Reinicia o cronômetro da partida                     |

### Regras de negócio

- A duração padrão da partida é de **5 minutos**.
- Quando o tempo se esgota, a partida é encerrada (`timer.endedAt`) e o
  vencedor é calculado automaticamente (time com mais pontos ou empate).
- Não é possível adicionar/remover pontos ou alterar os times após o término
  da partida — é necessário resetar o placar (`POST /reset`) para iniciar uma
  nova partida.

## Testes

```bash
npm test
```

Os testes de integração (`src/tests/score.integration.spec.js`) usam Supertest
para validar os endpoints da API.

