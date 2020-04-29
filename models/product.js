const fs = require('fs');
const path = require('path');

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

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        const updatedProducts = [...products];

        updatedProducts[existingProductIndex] = this;
        fs.writeFile(rootDir, JSON.stringify(updatedProducts), err =>
          console.log(err)
        );
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(rootDir, JSON.stringify(products), err =>
          console.log(err)
        );
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(rootDir, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
