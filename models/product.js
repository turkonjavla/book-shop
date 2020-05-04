const chalk = require('chalk');
const mongodb = require('mongodb');
const User = require('../models/user');

const { getDb } = require('../utils/database');

class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const user = new User();
    const db = getDb();
    let dbOp;

    if (this._id) {
      // update the product
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
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
        return products;
      })
      .catch(err => console.error(chalk.redBright(err.message)));
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then(product => product)
      .catch(err => console.error(chalk.brightRed(err.message)));
  }

  static deleteById(productId) {
    const db = getDb();

    return db
      .collection('products')
      .deleteOne({
        _id: new mongodb.ObjectId(productId),
      })
      .then(() => console.log(chalk.greenBright('Book removed')))
      .catch(err => console.error(chalk.redBright(err.message)));
  }
}

module.exports = Product;
