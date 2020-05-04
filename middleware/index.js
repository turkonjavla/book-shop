const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const CommonMiddleware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
};

const Middleware = app => {
  CommonMiddleware(app);
};

module.exports = Middleware;
