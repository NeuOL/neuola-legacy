/*
 * The Article module
 */

var common = require('../my/view/common');
var async = require('async');
var Post = require('../my/model/post')
  , Catalog = require('../my/model/catalog');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  async.parallel({
    posts: function(callback) {
      Post.list({'catalog.id': catalog}, callback);
    }, 
    catalog: function(callback) {
      Catalog.get(catalog, callback);
    }
  }, function (err, results) {
      if (!err) {
        res.render('catalog', {
          title: results.catalog.name,
          description: results.catalog.description,
          posts: results.posts
        });
      } else {
        common.error(res, err, '/');
      }
  });
};

exports.article = function article(req, res) {
  var article = req.params.article;
  Post.getByUrl(article, function(err, post) {
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
  var tags = req.param('tag')?req.param('tag').split(/\s*,\s*/):[];
  Post.list({tag:{$all:tags}}, function(err, posts) {
    if (err) {
      common.error(res, err, '/');
    } else {
      res.render('catalog', {
        title: tags.toString(),
        description: '所有关于“' + tags.toString() + '”的文章',
        posts: posts
      });
    }
  });
};
