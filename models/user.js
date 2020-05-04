const { getDb } = require('../utils/database');
const ObjectId = require('mongodb').ObjectId;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();

    db.collection('users').insertOne(this);
  }

  static findById(userId) {
    const db = getDb();

    return db.collection('users').findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
