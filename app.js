const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const db = require('./utils/database');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'jbeV*.EZaM6-EPzyFXfTFTdy',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000, () => {
  console.log('Server is running');
});
