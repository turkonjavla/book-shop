const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res) => {
  res.render('add-product', { docTitle: 'Add product' });
});

router.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports = {
  routes: router,
  products,
};
