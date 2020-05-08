const express = require('express');
const chalk = require('chalk');
const csrf = require('csurf');

const User = require('./models/user');

const { HTTP_PORT, HOST } = require('./keys');

const app = express();
const Middleware = require('./middleware');

Middleware(app);

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.listen(HTTP_PORT, () => {
  console.log(
    chalk.blueBright(`Server is running on http://${HOST}:${HTTP_PORT}`)
  );
});
