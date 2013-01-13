
/*
 * The Article module
 */

var Post = require('../my/model/post')
  , Catalog = require('../my/model/catalog');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  Post.list(catalog, function(err, posts) {
    Catalog.get(catalog, function(err, catalog) {
      res.render('catalog', {
        title: catalog.name,
        description: catalog.description,
        posts: posts
      });
    });
  });
};

exports.article = function article(req, res) {
  var catalog = req.params.catalog;
  var article = req.params.article;
  var name = '内部文章';
  Post.get(catalog, article, function(err, post) {
    res.render('article', {
      title: name,
      post: post
    });
  });
};

