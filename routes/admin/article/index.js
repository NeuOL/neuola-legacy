/*
 * The article controller for administration
 */

var async = require('async')
  , Post = require('../../../my/model/post')
  , Catalog = require('../../../my/model/catalog');

exports.catalog = require('./catalog');

function fetchAllCatalogsTask(callback) {
  Catalog.list({}, callback);
}

/*
 * The view of the create action.
 * @see #create()
 */
exports.createView = function createView(req, res) {
  async.series({
    catalogs: fetchAllCatalogsTask
  }, function(err, results) {
    res.render('admin/article-edit-page', {
      title: '创建新文章',
      post: {},
      catalogs: results.catalogs,
      actionUrl: '/admin/article/new'
    });
  });
};

/*
 * The create action
 */
exports.create = function create(req, res) {
  var tags = req.body.post.tag?req.body.post.tag.split(/\s*,\s*/):[];
  if (req.body.post.title && req.body.post.body && req.body.post.catalog && req.session.user) {
    var doc = {
      title: req.body.post.title,
      body: req.body.post.body,
      catalog: req.body.post.catalog,
      tag: tags,
      author: req.session.user.name,
      date: new Date(),
      url: req.body.post.url ? req.body.post.url : req.body.post.title
    };
    console.log(doc);

    var post = new Post(doc);
    post.save(function(err) {
      if (err) {
        res.render('error', {
          title: '出错了',
          message: '保存错误：' + err,
          link: '/admin/article/new'
        });
      } else {
        res.render('done', {
          title: '完成',
          message: '保存成功！',
          link: '/admin/'
        });
      }
    });
  } else {
    res.render('error', {
      title: '错误参数',
      message: '错误参数！',
      link: '/admin/'
    });
  }
};

/*
 * Delete the action by URL.
 */
exports.remove = function remove(req, res) {
  var catalog = req.params.catalog;
  var url = req.params.url;
  Post.remove({
    catalog: catalog,
    url: url
  }, function(err, post) {
    if (err) {
      res.render('error', {
        title: '出错了~',
        message: err,
        link: '/admin/'
      });
    } else {
      res.render('done', {
        title: '完成',
        message: '删除文档。',
        link: '/admin/'
      });
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
  async.series({
    post: function(callback) {
      Post.getByUrl(catalog, url, callback);
    },
    catalogs: fetchAllCatalogsTask
  }, function(err, results) {
    if (err || !results.post || results.post.author != author) {
      res.render('error', {
        title: '出错了~',
        message: '您确认这个URL是有效的？',
        link: '/admin/'
      });
    } else {
      var url = results.post.catalog + '/' + results.post.getUrl();
      res.render('admin/article-edit-page', {
        title: '正在编辑' + results.post.title,
        post: results.post,
        catalogs: results.catalogs,
        actionUrl: '/admin/article/edit/' + url
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
  var tags = req.body.post.tag?req.body.post.tag.split(/\s*,\s*/):[];
  var author = req.session.user.name;
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
    Post.findOneAndUpdate({
      url: oldId,
      author: author
    }, doc, {}, function(err) {
      if (err) {
        res.render('error', {
          title: '出错了~',
          message: '数据库链接可能出错了~',
          link: '/admin/'
        });
      } else {
        res.render('done', {
          title: '完成',
          message: '完成编辑~',
          link: '/admin/articles/'
        });
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
    author: req.session.user.name,
    catalog: {
      "$exists": true,
      "$nin": [null]
    }
  };
  if (catalog) {
    option.catalog = catalog;
  }
  async.series({
    posts: function(callback) {
      Post.list(option, function(err, posts) {
        callback(err, posts);
      });
    },
    catalogs: fetchAllCatalogsTask,
    catalog: function(callback) {
      if (catalog) Catalog.get(catalog, function(err, catalog) {
        callback(err, catalog);
      });
      else callback(null, {
        name: '所有文章'
      });
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
      res.render('error', {
        title: '文章',
        message: '没有这个栏目或者数据库出错了~',
        link: '/admin/'
      });
    }
  });
};


