const cors = require('cors');
const csrf = require('csurf');
const flash = require('connect-flash');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);

const { MONGO_URI } = require('../keys');
const User = require('../models/user');

const csrfProtection = csrf();

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions',
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const CommonMiddleware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));
  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store,
    })
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer({ storage, fileFilter }).single('image'));
  app.use(csrfProtection);
  app.use(flash());
  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }

    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        next(new Error(err));
      });
  });
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });
};

const Middleware = app => {
  CommonMiddleware(app);
};

module.exports = Middleware;
