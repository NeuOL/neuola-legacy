
var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  state: String,
  date: {
    type: Date,
    'default': Date.now,
  },
  catalog: String,
  tag: [String],
  url: String
});

postSchema.statics.list = function list(options, callback) {
  this.find(options).populate('author').exec(callback);
};

postSchema.statics.getByUrl = function getByUrl(catalog, url, callback) {
  this.findOne({
    catalog: catalog,
    $or: [{title: url, url:null}, {url: url}]
  }).exec(callback);
};

postSchema.virtual('res').get(function () {
  return this.catalog + '/' + this.getUrl();
});

postSchema.virtual('html').get(function () {
  return require('markdown').markdown.toHTML(this.body);
});

postSchema.methods.getUrl = function getUrl() {
  return this.url ? this.url : this.title;
};

module.exports = mongoose.model('Post', postSchema);

