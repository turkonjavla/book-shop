const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById('5eb1abdc23d56531c2653a60').then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/');
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
