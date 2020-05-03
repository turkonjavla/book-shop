const { MONGO_URI } = require('../keys');
const chalk = require('chalk');

const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
      console.log(
        chalk.greenBright('> Successfully connected to the database')
      );
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.error(chalk.redBright.bold(err.message));
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
