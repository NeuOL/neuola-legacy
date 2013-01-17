
/**
 * Mongoose's connection pool.
 *
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/qing');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

module.exports = db;
