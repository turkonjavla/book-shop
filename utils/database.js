const { MONGO_URI } = require('../keys');
const chalk = require('chalk');

const MongoClient = require('mongodb').MongoClient;

const mongoConnection = callback =>
  MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(result => {
      console.log(
        chalk.greenBright('> Successfully connected to the database')
      );
      callback(result);
    })
    .catch(err => comsole.error(chalk.redBright(err.message)));

module.exports = mongoConnection;
