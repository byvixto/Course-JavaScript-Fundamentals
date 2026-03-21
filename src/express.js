const scoreRoutes = require('./routes/score');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

//API
app.use('/api/score', scoreRoutes);

app.use(express.static(path.join(__dirname, 'public')));
module.exports = app;