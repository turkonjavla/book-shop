const mongoose = require('mongoose');
const chalk = require('chalk');

const { MONGO_URI } = require('../keys');

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log(chalk.greenBright('> Successfuly connected to the database'))
  )
  .catch(err =>
    console.error(
      chalk.redBright('Error with mongoose connection: ', err.message)
    )
  );

const db = mongoose.connection;

db.on('error', () =>
  console.error(chalk.redBright.bold('> Error occured from the database'))
);

db.once('open', () =>
  console.log(chalk.greenBright.bold('> Successfully accessed the database'))
);

module.exports = mongoose;
