const scoreRoutes = require('./routes/score');
const path = require('path');
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());


//API
app.use('/api/score', scoreRoutes);

app.use(express.static(path.join(__dirname, 'public')));





app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
