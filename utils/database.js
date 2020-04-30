const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'jbeV*.EZaM6-EPzyFXfTFTdy',
});

module.exports = pool.promise();
