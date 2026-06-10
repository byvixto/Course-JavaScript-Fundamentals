# Resumo — JavaScript, Node.js, CommonJS, HTML, CSS, DOM, Fetch, Express, Redes/HTTP, ESLint/Prettier, nodemon e ECMAScript

## 1. O que é um servidor

Um **servidor** é um programa que fica em execução esperando (escutando)
requisições — geralmente via **HTTP** — e devolve respostas para quem fez a
requisição (o **cliente**, ex.: navegador, app mobile, outro serviço).

### Modelo cliente-servidor

```
Cliente (navegador)  --- requisição HTTP --->  Servidor (Node + Express)
Cliente (navegador)  <--- resposta (HTML/JSON) ---  Servidor
```

- O cliente envia uma requisição para um **endereço + porta**
  (ex.: `http://localhost:3000/api/score/scoreboard`).
- O servidor recebe, processa (consulta dados, executa lógica de negócio) e
  devolve uma resposta com um **status code** (`200`, `404`, `500`, etc.) e
  um **corpo** (HTML, JSON, etc.).

### Neste projeto

```js
// src/server.js
const app = require('./express');

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

- `app.listen(3000, ...)` faz o servidor **escutar a porta 3000**.
- Enquanto esse processo Node estiver rodando, ele responde a:
  - requisições para `/` e arquivos estáticos (`/app.js`, `/style.css`,
    `index.html`) → servidos pela pasta `src/public`;
  - requisições para `/api/score/...` → tratadas pelo `scoreController`,
    que contém a lógica do placar/cronômetro.

---

## 2. Servidor estático vs. servidor dinâmico

### Servidor estático

Devolve **arquivos prontos**, exatamente como estão salvos em disco (HTML,
CSS, JS, imagens, fontes). A resposta não depende de lógica de negócio — só
de qual arquivo foi pedido.

```js
// src/express.js
app.use(express.static(path.join(__dirname, 'public')));
```

- Quando o navegador pede `/`, `/style.css` ou `/app.js`, o Express
  simplesmente lê o arquivo correspondente em `src/public` e o devolve.
- Mesmo conteúdo para qualquer pessoa que acessar (a menos que o arquivo em
  disco mude).

### Servidor dinâmico

Gera a resposta **em tempo de execução**, com base em lógica de negócio,
estado da aplicação e dados da requisição (`req.body`, `req.params`,
`req.query`).

```js
// src/express.js
app.use('/api/score', scoreRoutes); // scoreController -> MatchService
```

- `/api/score/scoreboard` devolve o placar/cronômetro **atuais**, que mudam a
  cada ponto marcado ou conforme o tempo passa.
- `/api/score/point` recebe `{ team: 'home' }` no corpo da requisição e
  **altera o estado** (`MatchService`) antes de responder — duas requisições
  idênticas podem gerar respostas diferentes, dependendo do estado atual da
  partida.

### Comparação

| | Estático | Dinâmico |
| --- | --- | --- |
| Conteúdo | Arquivo fixo em disco | Gerado em código, a cada requisição |
| Depende de estado/dados? | Não | Sim (memória, banco de dados, request) |
| Exemplo no projeto | `index.html`, `style.css`, `app.js` | `/api/score/*` |
| Mecanismo no Express | `express.static(...)` | Rotas (`router.get/post`) + lógica |

> Este projeto combina os dois: o **front-end** (HTML/CSS/JS) é servido de
> forma estática, enquanto a **API do placar** é totalmente dinâmica.

---

## 3. Redes: modelo OSI, TCP/IP, HTTP e status codes

Entender como uma requisição do navegador chega até o `app.listen(3000)` do
Node passa por alguns conceitos de redes.

### Modelo OSI (7 camadas)

Modelo teórico que descreve as camadas envolvidas em uma comunicação de rede,
da mais "física" até a mais "próxima do usuário":

| Camada | Nome | Exemplo |
| --- | --- | --- |
| 7 | Aplicação | HTTP, DNS, FTP — o que a aplicação "fala" |
| 6 | Apresentação | Criptografia/codificação (TLS/SSL, compressão) |
| 5 | Sessão | Abertura/manutenção/encerramento de sessões |
| 4 | Transporte | TCP, UDP — portas, confiabilidade |
| 3 | Rede | IP — endereçamento e roteamento entre redes |
| 2 | Enlace (Data Link) | Endereços MAC, switches, Ethernet/Wi-Fi |
| 1 | Física | Cabos, sinais elétricos/ópticos/rádio |

### Modelo TCP/IP (mais usado na prática)

É uma versão mais simples e prática, com 4 camadas, usada na internet real:

| TCP/IP | Equivalente na OSI | Exemplo |
| --- | --- | --- |
| Aplicação | 5, 6, 7 | HTTP, HTTPS, DNS |
| Transporte | 4 | TCP, UDP |
| Internet | 3 | IP (IPv4/IPv6) |
| Acesso à rede | 1, 2 | Ethernet, Wi-Fi |

### TCP (Transmission Control Protocol)

- Protocolo da **camada de transporte**, **orientado a conexão**.
- Antes de trocar dados, cliente e servidor fazem o **three-way handshake**:
  `SYN` → `SYN-ACK` → `ACK`.
- Garante entrega **confiável e ordenada** dos pacotes (retransmite se algo se
  perder).
- HTTP/HTTPS rodam sobre TCP (geralmente nas portas `80`/`443`; neste projeto,
  o servidor escuta na porta `3000`).

### IP (Internet Protocol)

- Protocolo da **camada de rede**, responsável por **endereçar** (IP de
  origem/destino) e **rotear** pacotes entre redes diferentes.

### HTTP (HyperText Transfer Protocol)

- Protocolo da **camada de aplicação**, baseado no modelo
  **requisição → resposta**.
- **Stateless**: cada requisição é independente; o servidor não "lembra"
  automaticamente de requisições anteriores (por isso, estado como o placar
  precisa ser guardado em algum lugar — neste projeto, em memória, no
  `MatchService`).
- **HTTPS** = HTTP + TLS (camada de criptografia/segurança).

#### Métodos HTTP usados no projeto

| Método | Uso típico | Exemplo no projeto |
| --- | --- | --- |
| `GET` | Buscar dados, sem alterar estado | `GET /api/score/scoreboard` |
| `POST` | Criar/alterar algo, geralmente com corpo (body) | `POST /api/score/point` |

#### Anatomia de uma requisição/resposta

```
POST /api/score/point HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{ "team": "home" }
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{ "success": true, "scoreBoard": { "homeScore": 1, "awayScore": 0 } }
```

### Status codes (códigos de status HTTP)

O primeiro dígito do código indica a **categoria** da resposta:

| Faixa | Categoria | Exemplos |
| --- | --- | --- |
| `1xx` | Informacional | `100 Continue` |
| `2xx` | Sucesso | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirecionamento | `301 Moved Permanently`, `304 Not Modified` |
| `4xx` | Erro do cliente | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `5xx` | Erro do servidor | `500 Internal Server Error` |

No projeto, o `scoreController` define o status da resposta com
`res.status(codigo).json(...)`:

```js
// sucesso
res.status(200).json(this.matchService.getScoreBoard());

// erro de validação (ex.: nomes de times inválidos)
return res.status(result.status).json({
  success: false,
  message: result.message,
});
```

---

## 4. JavaScript

JavaScript é uma linguagem de programação **interpretada**, **dinâmica** e
**multiparadigma** (procedural, orientada a objetos e funcional), criada
originalmente para rodar em navegadores e hoje também usada no back-end
(Node.js), em apps mobile, desktop, etc.

### Características principais

- **Tipagem dinâmica e fraca**: variáveis não têm tipo fixo (`let x = 1; x = 'a';`).
- **Tipos primitivos**: `string`, `number`, `boolean`, `null`, `undefined`,
  `symbol`, `bigint`.
- **Objetos e referências**: arrays, funções, objetos literais, `Map`, `Set`,
  `Date`, etc. são todos objetos.
- **Funções de primeira classe**: podem ser atribuídas a variáveis, passadas
  como argumento e retornadas de outras funções (callbacks, higher-order
  functions).
- **Escopo léxico**: `var` (escopo de função), `let`/`const` (escopo de bloco).
- **Closures**: uma função "lembra" do ambiente onde foi criada.
- **Prototype-based**: herança via protótipos (`Object.create`, `class` é
  açúcar sintático sobre protótipos).
- **Assíncrono e single-threaded**: usa um *event loop*, *callback queue* e
  *microtask queue* (Promises) para lidar com operações não bloqueantes
  (timers, requisições de rede, leitura de arquivos etc.).
- **Coerção de tipos**: `==` faz conversão implícita de tipos; `===` compara
  valor e tipo (recomendado usar `===`).
- **Operadores úteis**: *optional chaining* (`obj?.prop`), *nullish
  coalescing* (`valor ?? padrao`), *spread/rest* (`...`).

### Exemplo rápido

```js
const soma = (a, b) => a + b;

const numeros = [1, 2, 3];
const dobrados = numeros.map((n) => n * 2); // [2, 4, 6]

async function buscarDados(url) {
  const resposta = await fetch(url);
  return resposta.json();
}
```

---

## 5. Loops e estruturas de repetição

JavaScript oferece várias formas de repetir um bloco de código. A escolha
geralmente depende do que está sendo percorrido (um número de vezes, um
array, as chaves de um objeto, etc.).

### `for` clássico

Usado quando se sabe quantas vezes o laço deve repetir (ex.: nos testes deste
projeto, para simular vários pontos):

```js
// src/tests/integration/score.integration.spec.js
for (let i = 0; i < 2; i++) {
  await request(app).post('/api/score/point').send({ team: 'home' });
}
```

### `for...of`

Itera sobre os **valores** de um iterável (arrays, strings, `Map`, `Set`,
`NodeList`, etc.). É a forma mais comum hoje em dia para percorrer arrays:

```js
const times = ['home', 'away'];

for (const time of times) {
  console.log(time);
}
```

### `for...in`

Itera sobre as **chaves enumeráveis** de um objeto (não recomendado para
arrays, pois itera sobre os índices como strings):

```js
const placar = { homeScore: 2, awayScore: 1 };

for (const chave in placar) {
  console.log(chave, placar[chave]);
}
```

### `while` e `do...while`

Repetem enquanto uma condição for verdadeira. `do...while` executa o bloco
**ao menos uma vez**, mesmo que a condição já seja falsa:

```js
let tentativas = 0;
while (tentativas < 3) {
  tentativas++;
}

do {
  console.log('executa pelo menos uma vez');
} while (false);
```

### Métodos de iteração de array (estilo funcional)

Em vez de loops manuais, é muito comum usar métodos de array que recebem uma
função (callback):

```js
const placares = [0, 1, 2, 3];

placares.forEach((p) => console.log(p));     // executa para cada item
const dobro = placares.map((p) => p * 2);     // gera novo array transformado
const pares = placares.filter((p) => p % 2 === 0); // filtra itens
const total = placares.reduce((acc, p) => acc + p, 0); // acumula em um valor
const algumZero = placares.some((p) => p === 0); // true se algum item satisfaz
const todosPositivos = placares.every((p) => p >= 0); // true se todos satisfazem
const encontrado = placares.find((p) => p > 1); // primeiro item que satisfaz
```

> No projeto, o "loop" mais visível na UI é o `setInterval`, que repete uma
> ação a cada intervalo de tempo (ver seção de Fetch).

---

## 6. Estruturas de dados

### Objetos (`{}`)

Coleções de pares **chave-valor**, usadas para representar entidades. É a
estrutura mais usada no projeto (placar, timer, respostas da API):

```js
// src/model/scoreBoard.js
class ScoreBoard {
  constructor(homeTeam = 'time Da Casa', awayTeam = 'time Visitante', homeScore = 0, awayScore = 0) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.homeScore = homeScore;
    this.awayScore = awayScore;
  }
}
```

Operações comuns:

```js
const { homeTeam, awayScore } = scoreBoard; // desestruturação
const copia = { ...scoreBoard, homeScore: 0 }; // spread (cria uma cópia com alteração)
Object.keys(scoreBoard);   // ['homeTeam', 'awayTeam', 'homeScore', 'awayScore']
Object.values(scoreBoard); // valores
Object.entries(scoreBoard); // [[chave, valor], ...]
```

### Arrays (`[]`)

Listas ordenadas de valores, indexadas a partir de `0`:

```js
const times = ['home', 'away'];
times.push('extra');     // adiciona ao final
times.includes('home');  // true
times.length;            // 3
```

### `Map` e `Set`

- **`Map`**: como um objeto, mas as chaves podem ser de **qualquer tipo** e a
  ordem de inserção é preservada.
- **`Set`**: coleção de **valores únicos** (sem duplicados).

```js
const cache = new Map();
cache.set('placar', { homeScore: 0, awayScore: 0 });
cache.get('placar');

const idsUnicos = new Set([1, 2, 2, 3]); // Set { 1, 2, 3 }
```

### Classes

Usadas no projeto para modelar entidades com comportamento (`Match`,
`ScoreBoard`, `MatchService`, `MatchTimerService`, `ScoreController`):

```js
// src/model/match.js
class Match {
  constructor() {
    this.scoreBoard = new ScoreBoard();
    this.timer = this.createTimer();
    this.winner = null;
  }
}
```

---

## 7. HTML

**HTML (HyperText Markup Language)** é a linguagem de marcação usada para
estruturar o conteúdo de uma página web. Define **o que existe** na página
(títulos, parágrafos, botões, formulários), enquanto o **CSS** define a
aparência e o **JavaScript** define o comportamento.

### Estrutura básica (`src/public/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Placar da Partida</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <main class="container">
      <!-- conteúdo -->
    </main>
    <script src="/app.js"></script>
  </body>
</html>
```

- `<!DOCTYPE html>`: declara que o documento usa HTML5.
- `<head>`: metadados (charset, viewport, título da aba, links para CSS/fontes).
- `<meta name="viewport" ...>`: essencial para responsividade em dispositivos móveis.
- `<body>`: conteúdo visível da página.
- `<script src="/app.js">` no **final do `<body>`**: garante que o HTML já
  foi carregado/interpretado antes do JS tentar acessar elementos via
  `document.getElementById`.

### Elementos usados no projeto

- **Estruturais/semânticos**: `<main>`, `<section>` — agrupam partes da
  página com significado (cronômetro, formulário de times, placar, rodapé).
- **Texto**: `<h1>`, `<h2>`, `<p>` — títulos e parágrafos.
- **Interativos**: `<button>`, `<input>` — ações do usuário e entrada de
  texto.
- **Genéricos**: `<div>` — agrupamento sem significado semântico específico,
  usado para estilização/layout (ex.: `.team-card`, `.versus`).

### Atributos importantes

- `id`: identificador único, usado pelo JS (`getElementById`) e pelo CSS
  (`#id`).
- `class`: usado pelo CSS (`.classe`) e para selecionar grupos de elementos.
- `type`, `name`, `placeholder`: específicos de `<input>` (tipo do campo,
  nome usado em formulários, texto de exemplo).

```html
<input type="text" name="homeTeam" id="homeTeamInput" placeholder="nome do time A" />
<button id="homeAdd">+1</button>
```

### `<link>` para fontes externas

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
```

`rel="preconnect"` antecipa a conexão com o domínio das fontes, reduzindo a
latência ao carregar a fonte `Poppins` usada no `style.css`.

---

## 8. CSS e recursos usados no projeto (`src/public/style.css`)

CSS (Cascading Style Sheets) define a aparência visual do HTML. Além das
propriedades básicas (cor, tamanho, espaçamento), o projeto usa diversos
recursos modernos do CSS3:

### Reset e box model

```css
* {
  box-sizing: border-box; /* padding e borda não aumentam o tamanho final do elemento */
  margin: 0;
  padding: 0;
}
```

### Flexbox

Usado para centralizar e organizar os elementos em linha/coluna
(`.scoreboard`, `.actions`, `.timer-actions`, `body`):

```css
.scoreboard {
  display: flex;
  justify-content: center; /* alinhamento horizontal */
  align-items: center;     /* alinhamento vertical */
  gap: 24px;                /* espaço entre os itens */
  flex-wrap: wrap;          /* quebra linha em telas pequenas */
}
```

### Gradientes (`linear-gradient`)

Usados em fundos e botões:

```css
body {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%);
}
```

### Texto com gradiente (`background-clip: text`)

Aplica um gradiente como "cor" do texto:

```css
.score {
  background: linear-gradient(135deg, #60a5fa, #34d399);
  -webkit-background-clip: text; /* compatibilidade com navegadores WebKit */
  background-clip: text;
  color: transparent; /* o texto fica transparente para mostrar o gradiente */
}
```

### Transparência e `backdrop-filter`

Cria o efeito "vidro fosco" (glassmorphism):

```css
.container {
  background: rgba(255, 255, 255, 0.04); /* branco com 4% de opacidade */
  backdrop-filter: blur(12px);            /* desfoca o que está atrás */
}
```

### Transições (`transition`)

Anima mudanças de estado (hover, disabled, etc.):

```css
.timer-btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.timer-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
```

### Pseudo-classes e pseudo-elementos

- `:hover`, `:active`, `:focus`, `:disabled`, `:last-child`,
  `:not(:disabled)` — estados/posições de elementos.
- `::placeholder` — estiliza o texto de exemplo de um `<input>`.

```css
.teams-form input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.actions button:last-child {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}
```

### Media queries (responsividade)

Ajustam o layout conforme o tamanho da tela:

```css
@media (max-width: 768px) {
  .scoreboard {
    flex-direction: column; /* empilha os times em telas pequenas */
  }
}
```

### Outras propriedades usadas

- `border-radius`, `box-shadow`: cantos arredondados e sombras.
- `font-variant-numeric: tabular-nums`: garante que os números do cronômetro
  tenham largura fixa (não "tremem" ao mudar de dígito).
- `text-transform`, `letter-spacing`: estilização de texto.
- Fonte externa via Google Fonts (`Poppins`), carregada no `index.html` com
  `<link rel="preconnect">` para otimizar o carregamento.

---

## 9. Manipulação de DOM com JavaScript nativo

O **DOM (Document Object Model)** é a representação em árvore de um documento
HTML, manipulável via JavaScript no navegador (sem bibliotecas como jQuery).
É o que o `src/public/app.js` deste projeto usa para atualizar o placar na tela.

### Selecionar elementos

```js
document.getElementById('homeScore');        // por id
document.querySelector('.placar');           // primeiro elemento que casa o seletor CSS
document.querySelectorAll('.time-btn');       // NodeList com todos que casam
```

### Ler e alterar conteúdo/atributos

```js
elemento.textContent = 'Time A';   // texto puro (mais seguro contra XSS)
elemento.innerHTML = '<b>Time A</b>'; // permite HTML (cuidado com XSS)
elemento.setAttribute('data-id', '123');
elemento.classList.add('ativo');
elemento.classList.toggle('disabled', condicao);
elemento.style.color = 'red';
```

### Criar e inserir elementos

```js
const li = document.createElement('li');
li.textContent = 'Novo item';
listaEl.appendChild(li);
```

### Eventos

```js
// src/public/app.js
homeAdd.addEventListener('click', () => updatePoint('home', 'add'));
timerStartBtn.addEventListener('click', () => timerAction('start'));
```

### Propriedades de formulário

```js
// src/public/app.js
const homeTeam = homeTeamInput.value.trim();
if (!homeTeam) {
  alert('preencha o nome dos dois times');
}
```

### Padrão usado no projeto

`src/public/app.js` segue o padrão:

1. Seleciona elementos do DOM via `getElementById`.
2. Faz requisições `fetch` para a API (`/api/score/...`).
3. Atualiza o `textContent`/estado dos elementos com base na resposta JSON.

---

## 10. Uso do `fetch`

`fetch` é a API nativa do navegador (e também disponível no Node.js moderno)
para fazer requisições HTTP. Ela retorna uma **Promise**, então é usada com
`async`/`await` ou `.then()`.

### GET simples

```js
// src/public/app.js
const response = await fetch('http://localhost:3000/api/score/scoreboard');
const data = await response.json(); // converte o corpo da resposta em objeto JS
```

- `response.status`: código HTTP (`200`, `404`, etc.).
- `response.headers.get('content-type')`: lê um cabeçalho da resposta.
- `response.text()` / `response.json()`: lê o corpo da resposta (são
  assíncronos e **só podem ser lidos uma vez**).

### POST enviando JSON

```js
// src/public/app.js
const response = await fetch('/api/score/point', {
  method: 'POST',
  body: JSON.stringify({ team: 'home' }), // converte objeto JS em string JSON
  headers: {
    'Content-Type': 'application/json', // avisa o servidor que o body é JSON
  },
});

const data = await response.json();
```

No back-end, o `express.json()` (configurado em `src/express.js`) é o
middleware responsável por interpretar esse `body` JSON e disponibilizá-lo em
`req.body`.

### Tratamento de erros

`fetch` só rejeita a Promise em caso de **falha de rede**; respostas com erro
HTTP (4xx/5xx) ainda "resolvem" normalmente, então é comum verificar
`response.ok` ou `response.status`:

```js
try {
  const response = await fetch('/api/score/scoreboard');
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('erro ao buscar placar:', error);
}
```

### Repetindo requisições (polling)

O projeto usa `setInterval` para buscar o placar periodicamente e manter a
tela sincronizada com o servidor:

```js
// src/public/app.js
fetchScoreboard();
setInterval(fetchScoreboard, 1000); // busca o placar a cada 1 segundo
```

---

## 11. Node.js

Node.js é um **ambiente de execução (runtime) JavaScript** fora do navegador,
construído sobre o motor **V8** (o mesmo do Google Chrome). Ele permite rodar
JS no servidor, criar APIs, scripts de linha de comando, ferramentas de build
etc.

### Principais conceitos

- **Single-threaded + event loop**: assim como no navegador, o Node usa um
  loop de eventos para lidar com operações de I/O (arquivos, rede, banco de
  dados) sem bloquear a thread principal, delegando trabalho pesado para a
  *libuv* (thread pool).
- **Módulos nativos**: `fs`, `path`, `http`, `os`, `crypto`, `events`, etc.
- **NPM (Node Package Manager)**: gerenciador de pacotes/dependências
  (`package.json`, `package-lock.json`, pasta `node_modules`).
- **Sistemas de módulos**: suporta tanto **CommonJS** (`require`/`module.exports`)
  quanto **ES Modules** (`import`/`export`), definidos pelo campo `"type"` no
  `package.json` ou pela extensão do arquivo (`.cjs` / `.mjs`).
- **Ecossistema de servidores**: frameworks como **Express** (usado neste
  projeto) facilitam a criação de servidores HTTP, rotas, middlewares etc.
- **Ferramentas de desenvolvimento**: `nodemon` (auto-reload), `jest`
  (testes), `eslint`/`prettier` (qualidade/formatação).

---

## 12. Express

**Express** é um framework web minimalista para Node.js, construído sobre o
módulo nativo `http`. Ele facilita criar servidores, definir **rotas**,
processar requisições/respostas e usar **middlewares**.

### Configuração da aplicação (`src/express.js`)

```js
const scoreRoutes = require('./controller/scoreController');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json()); // middleware: interpreta body JSON em req.body

app.use('/api/score', scoreRoutes); // monta as rotas da API sob /api/score

app.use(express.static(path.join(__dirname, 'public'))); // serve arquivos estáticos (HTML, CSS, JS)

module.exports = app;
```

### Conceitos principais

- **`app.use(middleware)`**: registra uma função que roda em **toda
  requisição**, podendo ler/alterar `req`/`res` antes de chamar `next()`.
  - `express.json()`: faz o parse de requisições com `Content-Type:
    application/json`, populando `req.body`.
  - `express.static(pasta)`: serve arquivos da pasta diretamente (ex.:
    `/style.css`, `/app.js`, `index.html`).
- **Rotas**: associam um **método HTTP + caminho** a uma função
  `(req, res) => {}`.
- **`express.Router()`**: agrupa rotas relacionadas em um módulo separado,
  que depois é "montado" em um prefixo (`/api/score`) com `app.use(prefixo,
  router)`.

### Padrão usado no projeto (`src/controller/scoreController.js`)

O controller encapsula o `Router` em uma classe:

```js
class ScoreController {
  constructor() {
    this.router = express.Router();
    this.matchService = new MatchService();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/scoreboard', this.getScoreBoard.bind(this));
    this.router.post('/point', this.addPoint.bind(this));
    // ...
  }

  getScoreBoard(req, res) {
    res.status(200).json(this.matchService.getScoreBoard());
  }
}

module.exports = scoreController.router;
```

- `this.router.get/post(caminho, handler)`: define a rota e a função que
  trata a requisição.
- `.bind(this)`: garante que, dentro do handler, `this` continue se referindo
  à instância do `ScoreController` (e não ao `router`).
- `req`: objeto da requisição (`req.body`, `req.params`, `req.query`).
- `res`: objeto da resposta (`res.status(codigo).json(objeto)`).
- A lógica de negócio fica no `MatchService` — o controller apenas recebe a
  requisição, chama o serviço e devolve o resultado.

---

## 13. CommonJS

**CommonJS (CJS)** é o sistema de módulos padrão historicamente usado pelo
Node.js (este projeto usa `"type": "commonjs"` no `package.json`).

### Como funciona

- Cada arquivo é um **módulo isolado** com seu próprio escopo.
- Para **exportar**, usa-se `module.exports` (ou `exports`):

```js
// scoreBoard.js
class ScoreBoard { /* ... */ }

module.exports = { ScoreBoard };
```

- Para **importar**, usa-se `require()`:

```js
// matchService.js
const { ScoreBoard } = require('./scoreBoard');
```

### Características

- **Síncrono**: `require()` carrega o módulo imediatamente, de forma
  bloqueante (adequado para o servidor, onde os arquivos estão em disco
  local).
- **Cache de módulos**: um módulo só é executado uma vez; chamadas seguintes a
  `require()` retornam a mesma instância (importante para *singletons*, como
  o `scoreController` deste projeto).
- **`module.exports` vs `exports`**: `exports` é apenas um atalho/referência
  para `module.exports`; se você reatribuir `module.exports = {...}`, o
  `exports` antigo é descartado.

### CommonJS vs ES Modules (ESM)

| | CommonJS | ES Modules |
| --- | --- | --- |
| Sintaxe | `require()` / `module.exports` | `import` / `export` |
| Carregamento | Síncrono | Assíncrono (estático/analisável) |
| Extensão/config | `.cjs` ou `"type": "commonjs"` | `.mjs` ou `"type": "module"` |
| Uso típico | Node.js (legado) | Navegadores e Node.js moderno |

---

## 14. `package.json` — para que serve

O `package.json` é o **manifesto** do projeto Node.js: descreve metadados,
dependências e comandos do projeto. Sem ele, o `npm` não sabe o que instalar
nem quais scripts existem.

### Campos usados neste projeto

```json
{
  "name": "curso_mentoria_2026",
  "version": "1.0.0",
  "description": "curso para desenvolver um jogo com servidor express",
  "license": "ISC",
  "author": "victor",
  "type": "commonjs",
  "main": "server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --runInBand",
    "lint": "eslint .",
    "format": "prettier . --write"
  },
  "dependencies": {
    "express": "^5.2.1",
    "http-status-codes": "^2.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14",
    "jest": "^30.3.0",
    "eslint": "^10.1.0",
    "prettier": "^3.8.1"
  }
}
```

- **`name`, `version`, `description`, `author`, `license`**: identificam o
  projeto/pacote.
- **`type: "commonjs"`**: define que os arquivos `.js` usam `require`/
  `module.exports` (ver seção 11).
- **`main`**: arquivo de entrada caso o projeto seja usado como pacote.
- **`scripts`**: atalhos executados com `npm run <nome>` (ou `npm start`/
  `npm test` sem o `run`). Permitem padronizar comandos do dia a dia
  (rodar, testar, formatar, lintar) sem precisar decorar comandos longos.
- **`dependencies`**: pacotes necessários para a aplicação **rodar em
  produção** (ex.: `express`).
- **`devDependencies`**: pacotes usados apenas durante o
  **desenvolvimento** (testes, lint, formatação, auto-reload) — não são
  necessários para rodar `npm start` em produção.

### Arquivos relacionados

- **`package-lock.json`**: registra as **versões exatas** de todas as
  dependências (incluindo dependências de dependências), garantindo que
  `npm install` produza sempre a mesma `node_modules` para qualquer pessoa
  do time.
- **`node_modules/`**: pasta onde os pacotes são instalados; não é
  versionada (está no `.gitignore`), pois pode ser recriada com
  `npm install`.

---

## 15. ESLint e Prettier

São duas ferramentas complementares de **qualidade de código**, configuradas
neste projeto via `eslint.config.js`, `.prettierrc` e `.prettierignore`.

### ESLint — análise estática (encontra problemas)

ESLint analisa o código em busca de **erros, anti-padrões e código
suspeito** (variável não usada, comparação com `==`, etc.), sem executá-lo.

```js
// eslint.config.js (formato "flat config")
const js = require('@eslint/js');
const globals = require('globals');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  { ignores: ['node_modules/'] },
  js.configs.recommended, // regras recomendadas pelo próprio ESLint
  {
    files: ['eslint.config.js', 'src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { ...globals.node }, // reconhece globais do Node (require, module, process...)
    },
    rules: { 'no-console': 'off' },
  },
  eslintConfigPrettier, // desativa regras de ESLint que conflitam com o Prettier
];
```

- `js.configs.recommended`: conjunto de regras padrão (boas práticas gerais).
- `globals.node` / `globals.browser`: dizem ao ESLint quais variáveis globais
  existem em cada ambiente (`require`, `module` no Node; `document`, `window`
  no navegador), evitando falsos positivos de "variável não definida".
- `eslint-config-prettier`: remove regras de **estilo/formatação** do ESLint
  para não conflitar com o Prettier (cada ferramenta cuida de uma coisa).

### Prettier — formatação automática (define o estilo)

Prettier reformata o código automaticamente (indentação, aspas, ponto e
vírgula, quebras de linha) seguindo regras fixas, eliminando discussões sobre
estilo.

```json
// .prettierrc
{
  "semi": true,          // sempre usar ponto e vírgula
  "singleQuote": true,   // preferir aspas simples
  "trailingComma": "es5" // vírgula final onde o ES5 permite (arrays, objetos)
}
```

```
# .prettierignore
node_modules
package-lock.json
```

### Comandos (`package.json`)

| Comando | O que faz |
| --- | --- |
| `npm run lint` | Roda o ESLint e reporta problemas |
| `npm run lint:fix` | Roda o ESLint e corrige automaticamente o que for possível |
| `npm run format` | Formata todos os arquivos com Prettier |
| `npm run format:check` | Verifica se os arquivos estão formatados (sem alterar) — útil em CI |

---

## 16. nodemon

**nodemon** é uma ferramenta de desenvolvimento que **observa os arquivos do
projeto** e **reinicia automaticamente** o processo Node quando algo muda —
evitando ter que parar e rodar `node src/server.js` manualmente a cada
alteração.

### Configuração (`nodemon.json`)

```json
{
  "watch": ["src"],
  "ext": "js,json,html,css",
  "ignore": ["node_modules", "src/tests"]
}
```

- **`watch`**: pastas observadas — aqui, tudo dentro de `src/` (controllers,
  services, models, `public/`, etc.).
- **`ext`**: extensões de arquivo que disparam o restart (`.js`, `.json`,
  `.html`, `.css` — inclui o front-end em `src/public`).
- **`ignore`**: caminhos que **não** disparam restart (`node_modules` e os
  testes, que mudam com frequência durante o desenvolvimento mas não afetam
  o servidor em si).

### Uso

```bash
npm run dev
# -> nodemon src/server.js
```

Sempre que um arquivo `.js`, `.json`, `.html` ou `.css` dentro de `src/` for
salvo, o nodemon mata o processo atual e roda `node src/server.js`
novamente — útil para ver mudanças no servidor e na interface (`src/public`)
sem reiniciar manualmente.

---

## 17. ECMAScript 2025 vs ECMAScript 2015 (ES6)

**ECMAScript** é a especificação que define a linguagem JavaScript. A partir
de 2015, novas versões são lançadas **anualmente**.

### ECMAScript 2015 (ES6) — marco histórico

Introduziu boa parte da sintaxe "moderna" usada até hoje:

- `let` e `const` (escopo de bloco, substituindo grande parte do `var`)
- *Arrow functions* (`() => {}`)
- `class` e herança (`extends`, `super`)
- Template literals (`` `Olá ${nome}` ``)
- Desestruturação (`const { a, b } = obj`)
- Parâmetros default e *rest/spread* (`...args`)
- Módulos ES (`import`/`export`)
- `Promise` (programação assíncrona)
- `Map`, `Set`, `Symbol`
- *Iterators* e `for...of`

### ECMAScript 2025 (ES2025) — novidades recentes

Construído sobre tudo do ES6+, trazendo recursos mais modernos, entre eles:

- **`Promise.try()`**: executa uma função (síncrona ou assíncrona) sempre
  retornando uma Promise, simplificando tratamento de erros.
- **`Array.fromAsync()`**: cria arrays a partir de iteráveis/async iteráveis.
- **Métodos de `Set`**: `union`, `intersection`, `difference`,
  `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`.
- **Atributos de importação de módulos** (`import ... with { type: 'json' }`):
  permite importar JSON (e outros formatos) diretamente como módulo.
- **`RegExp` com flag `/v`** e melhorias em expressões regulares (conjuntos
  Unicode).
- **Iteradores com novos métodos** (`Iterator.prototype.map`, `.filter`,
  `.take`, `.drop`, etc.), trazendo para iteradores genéricos o estilo de
  métodos de array.
- **JSON modules** e melhorias gerais de interoperabilidade entre CommonJS e
  ESM.

### Resumo da evolução

| Aspecto | ES2015 (ES6) | ES2025 |
| --- | --- | --- |
| Declaração de variáveis | `let`/`const` introduzidos | Mantido, sem mudanças |
| Funções | Arrow functions, classes | Refinamentos em iteradores/async |
| Assincronismo | `Promise` | `Promise.try`, `Array.fromAsync`, melhor integração com iteradores |
| Módulos | `import`/`export` (ESM) | Atributos de import (ex.: JSON modules) |
| Coleções | `Map`, `Set` | Novos métodos de operações de conjunto em `Set` |
| Cadência de lançamento | Marco "grande" único | Lançamentos anuais incrementais |

> Na prática, a maior parte do código JavaScript escrito hoje usa fortemente
> a sintaxe do ES2015+ (let/const, arrow functions, classes, async/await,
> destructuring), enquanto os recursos do ES2025 são incrementos pontuais que
> ainda dependem do suporte do motor JS (Node.js/navegador) usado.
