
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  pic: String,
  description: String,
  verified: Boolean
});

userSchema.statics.get = function get(username, callback) {
  this.findOne({name: username}).exec(callback);
};

module.exports = mongoose.model('users', userSchema);

