/*
 * The article controller for administration
 */

var async = require('async'),
  Post = require('../../my/model/post'),
  Catalog = require('../../my/model/catalog');

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
  if (req.body.post.title && req.body.post.body && req.body.post.catalog && req.session.user) {
    var doc = {
      title: req.body.post.title,
      body: req.body.post.body,
      catalog: req.body.post.catalog,
      author: req.session.user.name,
      date: new Date(),
      url: req.body.url ? req.body.url : req.body.post.title
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
  Post.getByUrl(catalog, url, function(err, post) {
    if (err) {
      res.render('error', {
        title: '出错了~',
        message: err,
        link: '/admin/'
      });
    } else {
      post.remove();
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
  var author = req.session.user.name;
  var url = req.body.post.url;
  if (oldId && title && body && catalog && author) {
    var doc = {
      title: title,
      body: body,
      catalog: catalog,
      author: author,
      date: new Date(),
      url: req.body.url ? req.body.url : req.body.post.title
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

exports.catalog = {
  action: function catalogAction(req, res) {
    var action = req.body.action;
    switch (action) {
    case 'changeCatalog':
      var catalog = req.body.catalog
      res.redirect('/admin/articles/catalog/view/' + catalog);
      break;
    default:
      res.redirect('/admin/articles/');
    }
  },

  home: function catalogsView(req, res) {
    async.series({
      catalogs: fetchAllCatalogsTask
    }, function(err, results) {
      res.render('admin/catalog-browse-page', {
        title: '分类管理',
        catalogs: results.catalogs
      });
    });
  },

  createView: function catalogCreateView(req, res) {
    res.render('admin/catalog-edit-page', {
      title: '创建新分类',
      actionUrl: '/admin/articles/catalog/edit/',
      catalog: {}
    });
  },

  create: function catalogCreate(req, res) {
    var name = req.body.catalog.name;
    var id = req.body.catalog.id;
    var description = req.body.catalog.description;
    if (name && id && description) {
      var catalog = new Catalog({
        name: name,
        _id: id,
        description: description
      });
      catalog.save(function(err) {
        if (err) {
          res.render('error', {
            message: '数据库链接错误。',
            link: '/admin/articles/catalog/'
          });
        } else {
          res.render('done', {
            message: '保存修改。',
            link: '/admin/articles/catalog/'
          });
        }
      });
    } else {
      res.render('error', {
        message: '错误的参数。',
        link: '/admin/articles/catalog/'
      });
    }
  },

  updateView: function catalogUpdateView(req, res) {
    var id = req.params.catalog;
    async.series({
      catalog: function(callback) {
        Catalog.get(id, callback);
      }
    }, function(err, results) {
      if (!err) {
        res.render('admin/catalog-edit-page', {
          title: '正在编辑' + results.catalog.name,
          catalog: results.catalog,
          actionUrl: '/admin/articles/catalog/edit/'
        });
      } else {
        res.render('error', {
          message: '数据库连接错误！',
          link: '/admin/articles/catalog/'
        });
      }
    });
  },

  update: function catalogUpdate(req, res) {
    var oldId = req.body.catalog.oldId;
    var name = req.body.catalog.name;
    var id = req.body.catalog.id;
    var description = req.body.catalog.description;
    if (oldId && name && id && description) {
      Catalog.findOneAndUpdate({
        id: oldId
      }, {
        name: name,
        id: id,
        description: description
      }, {}, function(err) {
        if (err) {
          res.render('error', {
            message: err,
            link: '/admin/articles/catalog/'
          });
        } else {
          res.render('done', {
            message: '保存修改。',
            link: '/admin/articles/catalog/'
          });
        }
      });
    } else {
      res.render('error', {
        message: '错误的参数。',
        link: '/admin/articles/catalog/'
      });
    }
  },

  remove: function catalogRemove(req, res) {
    var id = req.params.catalog;
    Catalog.get(id, function(err, catalog) {
      catalog.remove(function(err) {
        if (err) {
          res.render('error', {
            message: '错误的参数。',
            link: '/admin/articles/catalog/'
          });
        } else {
          res.render('done', {
            message: '成功删除。',
            link: '/admin/articles/catalog/'
          });
        }
      });
    });
  }

};
