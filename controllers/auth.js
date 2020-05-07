const User = require('../models/user');

exports.getLogin = (req, res) => {
  console.log(req.session.user);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  req.session.isLoggedIn = true;
  User.findById('5eb1abdc23d56531c2653a60').then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect('/');
  });
};
