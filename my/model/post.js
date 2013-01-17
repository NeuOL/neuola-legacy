
var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: String,
  state: String,
  date: Date,
  catalog: String,
  url: String
});

postSchema.statics.list = function list(options, callback) {
  this.find(options).exec(callback);
};

postSchema.statics.getByUrl = function getByUrl(catalog, url, callback) {
  this.findOne({
    catalog: catalog,
    $or: [{title: url, url:null}, {url: url}]
  }).exec(callback);
};

postSchema.methods.getUrl = function getUrl() {
  return this.url ? this.url : this.title;
};

module.exports = mongoose.model('posts', postSchema);

