
var async = require('async');
var Picture = require('../../my/model/picture');

function error(res, message, link) {
  res.render('error', {
    message: message,
    link: link
  });
}

function info(res, message, link) {
  res.render('done', {
    message: message,
    link: link
  });
}

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
    var tags = req.body.pic.tag;
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
    var tags = req.body.pic.tag ? req.body.pic.tag.split(',') : [];
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
    async.series({
      pics: function(callback) {
        Picture.list(10, callback);
      }
    }, function(err, results) {
      if (err) {
        error(res, err, '/admin/pictures/');
      } else {
        res.render('admin/picture-browse-page', {
          pics: results.pics
        });
      }
    });
  }
};
