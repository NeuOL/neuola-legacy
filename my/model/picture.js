
var mongoose = require('mongoose');

var slideSchema = new mongoose.Schema({
  src: String,
  title: String,
  description: String,
  update: Date,
  tag: [String]
});

slideSchema.statics.list = function list(num, callback) {
  this.find().limit(num).exec(function (err, slides) {
    callback(err, slides);
  });
};

module.exports = mongoose.model('Slide', slideSchema);

