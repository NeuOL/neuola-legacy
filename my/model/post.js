
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
  catalog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog'
  },
  tag: [String],
  url: {
    type: String,
    required: true
  }
});

postSchema.statics.list = function list(options, callback) {
  var self = this;
  require('./catalog').findOne({
    id: options['catalog.id']
  }, function(err, catalog) {
    if (catalog) {
      delete options['catalog.id'];
      options.catalog = catalog._id;
    }
    self.find(options)
        .populate('author')
        .populate('catalog')
        .sort({date:-1})
        .exec(callback);
  });
};

postSchema.statics.getByUrl = function getByUrl(url, callback) {
  this.findOne({
    url: url
  }).populate('author').populate('catalog').exec(callback);
};

postSchema.virtual('html').get(function () {
  return require('marked')(this.body);
});

module.exports = mongoose.model('Post', postSchema);

