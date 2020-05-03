const fs = require('fs');
const path = require('path');

const { getDb } = require('../utils/database');

const Cart = require('./cart');

const products = [];

const rootDir = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(rootDir, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent));
  });
  return products;
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this)
      .then(result => {
        console.log(chalk.yellow(result));
      })
      .catch(err => console.error(chalk.brightRed(err.message)));
  }
}

module.exports = Product;
