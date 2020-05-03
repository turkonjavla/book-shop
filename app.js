const express = require('express');
const chalk = require('chalk');

const { HTTP_PORT, HOST } = require('./keys');
const { mongoConnect } = require('./utils/database');

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

mongoConnect(() => {
  app.listen(HTTP_PORT, () => {
    console.log(
      chalk.blueBright(`Server is running on http://${HOST}:${HTTP_PORT}`)
    );
  });
});
