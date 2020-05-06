const express = require('express');
const chalk = require('chalk');

const User = require('./models/user');

const { HTTP_PORT, HOST } = require('./keys');

const app = express();
const Middleware = require('./middleware');

Middleware(app);

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
app.use((req, res, next) => {
  User.findById('5eb1abdc23d56531c2653a60').then(user => {
    req.user = user;
    next();
  });
});

app.listen(HTTP_PORT, () => {
  console.log(
    chalk.blueBright(`Server is running on http://${HOST}:${HTTP_PORT}`)
  );
});
