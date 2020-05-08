const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const PasswordHasher = require('../services/password-hasher');
const { SENDGRID_API_KEY } = require('../keys');

const passwordHasher = new PasswordHasher();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

exports.getSignup = (req, res) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage,
  });
};

exports.postSignup = async (req, res) => {
  let { email, password } = req.body;

  // @TODO: validate user input

  try {
    const user = await User.findOne({ email });

    if (user) {
      req.flash('error', 'Email already taken.');
      return res.redirect('/signup');
    }

    password = await passwordHasher.hash(password);

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    await transporter.sendMail({
      to: email,
      from: 'turkonjavlada@gmail.com',
      subject: 'Welcome to the book store!',
      html: '<h1>Successfully signed up!</h1>',
    });

    res.redirect('/login');
  } catch (error) {
    console.error(error.message);
  }
};

exports.getLogin = (req, res) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid email or password');
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
