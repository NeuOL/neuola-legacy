
var mongoose = require('mongoose')
  , async = require('async')
  ;

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
  renderModel: {
    type: String,
    'default': 'post'
  },
  catalog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog'
  },
  tag: [String],
  url: {
    type: String,
    required: true
  },
  source: {
    name: {
      type: String,
      trim: true
    },
    link: {
      type: String,
      trim: true
    }
  }
});

/**
 * List the posts by specify options.
 */
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

/**
 * Get a particular post by its URL.
 *
 * @param url the URL.
 * @param callback (err, post)
 */
postSchema.statics.getByUrl = function getByUrl(url, callback) {
  this.findOne({
    url: url
  }).populate('author').populate('catalog').exec(callback);
};

/**
 * List posts by tag.
 *
 * @param tags array of string
 * @param callback (err, pageNo, pages, posts)
 */
postSchema.statics.listByTag = function (tags, options, callback) {
  var model = require('./index')
    , pageNo = options.pageNo
    , itemsPerPage = options.itemsPerPage
    ;
  if (!pageNo || pageNo <= 0) pageNo = 1;
  async.waterfall([
    function (callback) {
      model.Post.find({tag:{$all:tags}}).count(function (err, count) {
        var pages = parseInt(count / itemsPerPage) + 1;
        if (pageNo > pages) {
          pageNo = pages;
        }
        callback(err, pageNo, pages);
      });
    },
    function (pageNo, pages, callback) {
      console.log(pageNo);
      model.Post.find({tag: {$all:tags}})
                .skip((pageNo-1)*itemsPerPage)
                .exec(function (err, posts) {
        callback(err, pageNo, pages, posts);
      });
    }
  ], callback);
};

/**
 * A virtual method to get the HTML-coded content of post body.
 */
postSchema.virtual('html').get(function () {
  return require('marked')(this.body);
});

module.exports = mongoose.model('Post', postSchema);

