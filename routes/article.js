/*
 * The Article module
 */

var common = require('../my/view/common');
var async = require('async');
var model = require('../my/model');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  if (req.xhr) {
    model.Catalog.listLatest({
      catalog: catalog
    }, function (err, c, posts) {
      res.render('catalog-ajax', {
        posts: posts
      });
    });
  } else {
    model.Catalog.listPosts({
      pageNo: req.param('page'),
      itemsPerPage: 10,
      catalog: catalog
    }, function (err, pageNo, allPagesNo, c, posts) {
        if (!err) {
          res.render('catalog', {
            title: c.name,
            description: c.description,
            posts: posts,
            pages: allPagesNo,
            page: pageNo
          });
        } else {
          common.error(res, err, '/');
        }
    });
  }
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
  var tags = req.param('tag')?req.param('tag').split(/\s*,\s*/):[];
  model.Post.listByTag(tags, {
    pageNo: req.param('page'),
    itemsPerPage: 10
  }, function (err, pageNo, pages, posts) {
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
