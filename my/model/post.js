
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
  url: {
    type: String,
    required: true
  }
});

postSchema.statics.list = function list(options, callback) {
  this.find(options).populate('author').exec(callback);
};

postSchema.statics.getByUrl = function getByUrl(url, callback) {
  this.findOne({
    url: url
  }).exec(callback);
};

postSchema.virtual('html').get(function () {
  return require('markdown').markdown.toHTML(this.body);
});

module.exports = mongoose.model('Post', postSchema);

