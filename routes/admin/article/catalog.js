
var async = require('async')
  , model = require('../../../my/model')
  ;

function fetchAllCatalogsTask(callback) {
  model.Catalog.list({}, callback);
}

module.exports = {
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
      actionUrl: '/admin/articles/catalog/new/',
      catalog: {}
    });
  },

  create: function catalogCreate(req, res) {
    var name = req.body.catalog.name;
    var id = req.body.catalog.id;
    var description = req.body.catalog.description;
    if (name && id && description) {
      var catalog = new model.Catalog({
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
        model.Catalog.get(id, callback);
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
      mdoel.Catalog.findOneAndUpdate({
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
    model.Catalog.remove({
      id: id
    }, function(err) {
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
  }

};
