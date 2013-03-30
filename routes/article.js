/*
 * The Article module
 */

var common = require('../my/view/common');
var async = require('async');
var model = require('../my/model');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  var itemsPerPage = 10;
  var pageNo = req.param('page');
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
      var pages = parseInt(count / itemsPerPage)+1;
      if (pageNo > pages) {
        pageNo = pages
      }
      model.Post.find({'catalog': c._id}).skip((pageNo-1)*itemsPerPage).limit(itemsPerPage).exec(function (err, posts) {
        callback(err, c, pages, posts);
      });
    } 
  ], function (err, c, pages, posts) {
      if (!err) {
        if (! req.xhr) {
          res.render('catalog', {
            title: c.name,
            description: c.description,
            posts: posts,
            pages: pages,
            page: pageNo
          });
        } else {
          res.render('catalog-ajax', {
            posts: posts
          });
        }
      } else {
        common.error(res, err, '/');
      }
  });
};

exports.article = function article(req, res) {
  var article = req.params[0];
  model.Post.getByUrl(article, function(err, post) {
    if (post) {
      res.render('article', {
        title: post.title,
        post: post
      });
    } else {
      common.error(res, '没有这篇文章吧？', '/');
    }
  });
};

exports.tag = function tag(req, res) {
  var itemsPerPage = 10;
  var pageNo = req.param('page');
  if (!pageNo || pageNo <= 0) pageNo = 1;
  var tags = req.param('tag')?req.param('tag').split(/\s*,\s*/):[];
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
  ], function (err, pageNo, pages, posts) {
    if (err) {
      common.error(res, err, '/');
    } else {
      res.render('catalog-search', {
        title: tags.toString(),
        description: '所有关于「' + tags.toString() + '」的文章',
        tags: tags.toString(),
        posts: posts,
        pages: pages,
        page: pageNo
      });
    }
  });
};
