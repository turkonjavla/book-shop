const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(3000, () => {
  console.log('Server is running');
});
