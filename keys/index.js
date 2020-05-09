require('dotenv').config();

module.exports = {
  HTTP_PORT: process.env.HTTP_PORT,
  HOST: process.env.HOST,
  MONGO_URI: process.env.MONGO_URI,
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  RESET_PASSWORD_EMAIL: process.env.RESET_PASSWORD_EMAIL,
};
