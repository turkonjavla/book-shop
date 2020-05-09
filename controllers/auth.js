const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const PasswordHasher = require('../services/password-hasher');
const { SENDGRID_API_KEY, RESET_PASSWORD_EMAIL } = require('../keys');

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

exports.getReset = (req, res) => {
  let errorMessage = req.flash('error');

  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    message = null;
  }

  res.render('auth/reset-password', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage,
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No user with that email exists');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

        return user.save();
      })
      .then(() => {
        transporter.sendMail({
          to: req.body.email,
          from: RESET_PASSWORD_EMAIL,
          subject: 'Password Reset',
          html: `
              <p>Click on the link below to reset your password<p>
              <a href='http://localhost:3000/reset/${token}'>Click here</a>
            `,
        });
        res.redirect('/');
      })
      .catch(err => console.error(err.message));
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      let errorMessage = req.flash('error');

      if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
      } else {
        message = null;
      }

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err => console.error(err.message));
};

exports.postNewPassword = async (req, res) => {
  let { userId, newPassword, passwordToken } = req.body;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    newPassword = await passwordHasher.hash(newPassword);
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiration = undefined;

    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error.message);
  }
};
