/*
 * The Article module
 */

var Post = require('../my/model/post'),
  Catalog = require('../my/model/catalog');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  Post.list({
    catalog: catalog
  }, function(err, posts) {
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
  Post.getByUrl(catalog, article, function(err, post) {
    res.render('article', {
      title: post.title,
      post: post
    });
  });
};

exports.tag = function tag(req, res) {
  var tags = req.param('tag')?req.param('tag').split(/\s*,\s*/):[];
  Post.find({tag:{$all:tags}}, function(err, posts) {
    if (err) {
      res.render('error', {
        message: err,
        link: '/'
      });
    } else {
      res.render('catalog', {
        title: tags.toString(),
        description: '所有关于“' + tags.toString() + '”的文章',
        posts: posts
      });
    }
  });
};
