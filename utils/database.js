const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'node-complete',
  'root',
  'jbeV*.EZaM6-EPzyFXfTFTdy',
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;
