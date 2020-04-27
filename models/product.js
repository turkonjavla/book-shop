const fs = require('fs');
const path = require('path');

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

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(rootDir, JSON.stringify(products), err => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
