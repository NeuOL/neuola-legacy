
/*
 * The catalog model
 */

var mongoose = require('mongoose');

var catalogSchema = new mongoose.Schema({
  name: String,
  description: String,
  id: String
});

catalogSchema.statics.list = function list(options, callback) {
  this.find(options).exec(callback);
};

catalogSchema.statics.get = function get(id, callback) {
  this.findOne({id: id}).exec(callback);
}

module.exports = mongoose.model('Catalog', catalogSchema);

