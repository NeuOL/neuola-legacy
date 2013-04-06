
/*
 * The catalog model
 */

var mongoose = require('mongoose')
  , async = require('async')
  ;

var catalogSchema = new mongoose.Schema({
  name: String,
  description: String,
  id: String
});

/**
 * List posts under the catalog.
 *
 * @param options {
 *   catalog: the path of catalog.
 *   itemsPerPage: the number of items per page.
 *   pageNo: current page number.
 * }
 * @param callback (err, pageNo, allPageNo, catalog, posts)
 */
catalogSchema.statics.listPosts = function (options, callback) {
  var catalog = options.catalog
    , pageNo = options.pageNo
    , itemsPerPage = options.itemsPerPage
    , model = require('./index')
    ;

  if (! pageNo || pageNo <= 0) pageNo = 1;

  async.waterfall([
    function(callback) {
      model.Catalog.get(catalog, callback);
    },
    function(c, callback) {
      model.Post.find({'catalog': c._id}).count(function (err, count) {
        callback(err, c, count);
      });
    },
    function(c, count, callback) {
      var allPagesNo = parseInt(count / itemsPerPage)+1;
      if (pageNo > allPagesNo) {
        pageNo = allPagesNo;
      }
      model.Post.find({'catalog': c._id}).sort({date:'desc'}).skip((pageNo-1)*itemsPerPage).limit(itemsPerPage).exec(function (err, posts) {
        callback(err, pageNo, allPagesNo, c, posts);
      });
    } 
  ], callback);

};

catalogSchema.statics.listLatest = function (options, callback) {
  var catalog = options.catalog
    , model = require('./index')
    ;
  async.waterfall([
    function(callback) {
      model.Catalog.get(catalog, callback);
    },
    function(c, callback) {
      model.Post.findOne({catalog:c._id}).sort({date:'desc'}).exec(function (err, post) {
        if (! err && post) {
          var d = post.date;
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          model.Post.find({catalog: c._id, date: {$gt:d}}).sort({date:'desc'}).exec(function (err, posts) {
            callback(err, c, posts);
          });
        } else {
          callback(err, c, {});
        }
      });
      
    } 
  ], callback);
};

catalogSchema.statics.list = function list(options, callback) {
  this.find(options).exec(callback);
};

catalogSchema.statics.get = function get(id, callback) {
  this.findOne({id: id}).exec(callback);
}

module.exports = mongoose.model('Catalog', catalogSchema);

