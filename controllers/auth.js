const User = require('../models/user');
const PasswordHasher = require('../services/password-hasher');

const passwordHasher = new PasswordHasher();

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postSignup = async (req, res) => {
  let { email, password } = req.body;

  // @TODO: validate user input

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.redirect('/signup');
    }

    password = await passwordHasher.hash(password);

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error.message);
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect('/login');
    }

    if ((await passwordHasher.check(password, user.password)) === true) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        if (!err) {
          return res.redirect('/');
        }
      });
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error(error.message);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error when loging out: ', err.message);
    }
    res.redirect('/');
  });
};
