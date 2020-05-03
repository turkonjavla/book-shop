const chalk = require('chalk');

const { getDb } = require('../utils/database');

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

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.error(chalk.redBright(err.message)));
  }
}

module.exports = Product;
