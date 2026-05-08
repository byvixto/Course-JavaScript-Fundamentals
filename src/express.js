const scoreRoutes = require('./controller/scoreController');
const path = require('path');
const express = require('express');
class AppServer {
  constructor() {
    this.app = express();
    this.configureRoutes();
  }
  configureRoutes() {
    this.app.use(express.json());

    //API
    this.app.use('/api/score', scoreRoutes);

    this.app.use(express.static(path.join(__dirname, 'public')));
  }
}
const appserver = new AppServer();

module.exports = appserver.app;
module.exports.AppServer = AppServer;
