const User = require('../models/user');

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res) => {
  res.send('Signed up');
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  User.findById('5eb1abdc23d56531c2653a60').then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save(err => {
      if (err) {
        console.error(err);
        return;
      }
      res.redirect('/');
    });
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error when loging out: ', err.message);
    }
    res.redirect('/');
  });
};
