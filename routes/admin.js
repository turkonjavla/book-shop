const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res) => {
  res.send(`
    <form action='/admin/add-product' method='POST'>
      <input type='text' placeholder='title' />
      <button type='submit'>Add product</button>
    </form>
  `);
});

router.post('/add-product', (req, res) => {
  res.send('Success');
});

module.exports = router;
