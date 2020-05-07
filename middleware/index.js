const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { MONGO_URI } = require('../keys');
const User = require('../models/user');

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

const CommonMiddleware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store,
    })
  );
  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }

    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.error(err.message));
  });
};

const Middleware = app => {
  CommonMiddleware(app);
};

module.exports = Middleware;
