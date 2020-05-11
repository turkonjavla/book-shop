const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password', 'Password must be at least 5 characters long')
      .trim()
      .isLength({
        min: 5,
      }),
  ],
  authController.postLogin
);

router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .custom(async value => {
        return User.findOne({ email: value }).then(user => {
          if (user) {
            return Promise.reject(`${value} has already been taken`);
          }
        });
      }),
    body('password', 'Password must be at least 5 characters').trim().isLength({
      min: 5,
    }),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(`Passwords don't match`);
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
