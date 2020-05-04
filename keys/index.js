require('dotenv').config();

module.exports = {
  HTTP_PORT: process.env.HTTP_PORT,
  HOST: process.env.HOST,
  MONGO_URI: process.env.MONGO_URI,
};
