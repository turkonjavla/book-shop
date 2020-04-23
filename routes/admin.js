const express = require('express');
const path = require('path');

const rootDir = require('../utils/pathUtil');

const router = express.Router();

router.get('/add-product', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
  console.log('Success: ', req.body);
  res.redirect('/');
});

module.exports = router;
