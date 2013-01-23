
var async = require('async');
var Picture = require('../../my/model/picture');
var common = require('../../my/view/common');

var error = common.error;
var info = common.info;

module.exports = {
  createView: function createView(req, res) {
    res.render('admin/picture-edit-page', {
      title: '新建图片',
      actionUrl: '/admin/pictures/new/',
      pic: {}
    });
  },
  create: function create(req, res) {
    var src = req.files.pic.file.path;
    if (src) {
      src = '/uploads' + src.substr(src.lastIndexOf('/'));
    }
    var title = req.body.pic.title;
    var description = req.body.pic.description;
    var tags = req.body.pic.tag?req.body.pic.tag.split(/\s*,\s*/):[];
    if (src && title && description && tags) {
      var pic = new Picture({
        src: src,
        title: title,
        description: description,
        tag: tags,
        update: new Date()
      });
      pic.save(function(err) {
        if (err) {
          error(res, err, '/admin/pictures/');
        } else {
          info(res, err, '/admin/pictures/');
        }
      });
    }
  },

  updateView: function updateView(req, res) {
    var id = req.params.pic;
    Picture.findOne({
      _id: id
    }, function(err, pic) {
      res.render('admin/picture-edit-page', {
        title: '编辑' + pic.title,
        actionUrl: '/admin/pictures/update/',
        pic: pic
      });
    });
  },
  update: function update(req, res) {
    var oldId = req.body.pic.oldId;
    var src = req.body.pic.src;
    var title = req.body.pic.title;
    var description = req.body.pic.description;
    var tags = req.body.pic.tag ? req.body.pic.tag.split(/\s*,\s*/) : [];
    if (oldId && src && title && description && tags) {
      Picture.findOneAndUpdate({
        _id: oldId
      }, {
        src: src,
        title: title,
        description: description,
        tag: tags,
        update: new Date()
      }, function(err) {
        if (err) {
          error(res, err, '/admin/pictures/');
        } else {
          info(res, '完成！', '/admin/pictures/');
        }
      });
    } else {
      error(res, '参数错误！', '/admin/pictures/');
    }
  },

  remove: function remove(req, res) {
    var id = req.params.pic;
    Picture.remove({
      _id: id
    }, function(err) {
      if (err) {
        error(res, err, '/admin/pictures/');
      } else {
        info(res, '完成。', '/admin/pictures/');
      }
    });
  },

  browse: function browse(req, res) {
    var tags = req.param('tag') ? req.param('tag').split(/[\s*,\s*]/):null;
    async.series({
      pics: function(callback) {
        if (! tags)
          Picture.list(10, callback);
        else
          Picture.find({tag:{$all:tags}}, callback);
      }
    }, function(err, results) {
      if (err) {
        error(res, err, '/admin/pictures/');
      } else {
        res.render('admin/picture-browse-page', {
          pics: results.pics,
          tags: tags
        });
      }
    });
  }
};
