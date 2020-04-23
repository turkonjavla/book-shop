const path = require('path');

module.exports = path.dirname(process.mainModule.filename); // gets the root path in any file
