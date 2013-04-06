/*
 * The article controller for administration
 */

var async = require('async');
var model = require('../../../my/model');
var common = require('../../../my/view/common');

exports.catalog = require('./catalog');

function fetchAllCatalogsTask(callback) {
  model.Catalog.list({}, callback);
}

/*
 * The view of the create action.
 * @see #create()
 */
exports.createView = function createView(req, res) {
  async.parallel({
    catalogs: fetchAllCatalogsTask
  }, function(err, results) {
    res.render('admin/article-edit-page', {
      title: '创建新文章',
      post: {catalog:{},author:{},source:{}},
      catalogs: results.catalogs,
      actionUrl: 'admin/article/new'
    });
  });
};

/*
 * The create action
 */
exports.create = function create(req, res) {
  var tags = req.body.post.tag ? req.body.post.tag.split(/\s*,\s*/) : [];
  if (req.body.post.title && req.body.post.body && req.body.post.catalog && req.session.user) {
    var doc = {
      title: req.body.post.title,
      body: req.body.post.body,
      catalog: req.body.post.catalog,
      tag: tags,
      source: {
        name: req.body.post.author,
        link: req.body.post.source
      },
      author: req.session.user._id,
      date: new Date(),
      url: req.body.post.url ? req.body.post.url : req.body.post.title
    };

    var post = new model.Post(doc);
    post.save(function(err) {
      if (err) {
        res.render('error', {
          title: '出错了',
          message: '保存错误：' + err,
          link: 'admin/article/new'
        });
        common.error(res, err, 'admin/article/new');
      } else {
        common.info(res, '保存成功！', 'admin/articles/');
      }
    });
  } else {
    common.error(res, '错误参数！', 'admin/');
  }
};

/*
 * Delete the action by URL.
 */
exports.remove = function remove(req, res) {
  var catalog = req.params.catalog;
  var url = req.params.url;
  model.Post.remove({
    url: url
  }, function(err, post) {
    if (err) {
      common.error(res, err, 'admin/');
    } else {
      common.info(res, '删除文档。', 'admin/');
    }
  });
};

/*
 * The view for update action.
 * @see #update()
 */
exports.updateView = function updateView(req, res) {
  var catalog = req.params.catalog;
  var url = req.params.url;
  var author = req.session.user.name;
  async.parallel({
    post: function(callback) {
      model.Post.getByUrl(url, callback);
    },
    catalogs: fetchAllCatalogsTask
  }, function(err, results) {
    if (err || !results.post || results.post.author.name != author) {
      common.error(res, err); //'您确认这个URL是有效的？', '/admin/');
    } else {
      res.render('admin/article-edit-page', {
        title: '正在编辑' + results.post.title,
        post: results.post,
        catalogs: results.catalogs,
        actionUrl: 'admin/article/edit/' + results.post.url
      });
    }
  });
};

/*
 * The update action.
 */
exports.update = function update(req, res) {
  var oldId = req.body.post.oldId;
  var title = req.body.post.title;
  var body = req.body.post.body;
  var catalog = req.body.post.catalog;
  var tags = req.body.post.tag ? req.body.post.tag.split(/\s*,\s*/) : [];
  var author = req.session.user._id;
  var url = req.body.post.url;
  if (oldId && title && body && catalog && author) {
    var doc = {
      title: title,
      body: body,
      catalog: catalog,
      tag: tags,
      author: author,
      date: new Date(),
      url: req.body.post.url ? req.body.post.url : req.body.post.title
    };

    // TODO check if the user have the right to edit the article.
    model.Post.findOneAndUpdate({
      url: oldId,
      author: author
    }, doc, {}, function(err) {
      if (err) {
        common.error(res, err, 'admin/');
      } else {
        common.info(res, '完成编辑！', 'admin/articles/');
      }
    });
  }
};

/*
 * Browse all the records
 */
exports.browse = function browse(req, res) {
  var catalog = req.params.catalog;
  var option = {
    author: req.session.user._id,
    /*
    catalog: {
      "$exists": true,
      "$nin": [null]
    }
    */
  };
  if (catalog) {
    //option.catalog = catalog;
    option['catalog.id'] = catalog;
  }
  async.parallel({
    posts: function(callback) {
      model.Post.list(option, callback);
    },
    catalogs: fetchAllCatalogsTask,
    catalog: function(callback) {
      if (catalog) {
        model.Catalog.get(catalog, function(err, catalog) {
          callback(err, catalog);
        });
      } else {
        callback(null, {
          name: '所有文章'
        });
      }
    }
  }, function(err, results) {
    if (!err && results.posts && results.catalogs && results.catalog) {
      res.render('admin/article-browse-page', {
        title: results.catalog.name,
        catalog: results.catalog,
        catalogs: results.catalogs,
        posts: results.posts
      });
    } else {
      common.error(res, err, 'admin/');
    }
  });
};
