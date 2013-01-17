
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  password: String
});

userSchema.statics.get = function get(username, callback) {
  this.findOne({name: username}).exec(callback);
};

module.exports = mongoose.model('users', userSchema);

