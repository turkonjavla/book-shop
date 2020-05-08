const bcrypt = require('bcryptjs');
const { BCRYPT_ROUNDS } = require('../keys');

module.exports = class PasswordHasher {
  constructor() {
    this.rounds = parseInt(BCRYPT_ROUNDS);
  }

  async hash(password) {
    return await bcrypt.hash(password, this.rounds);
  }

  async check(password, hash) {
    return await bcrypt.compare(password, hash);
  }
};
