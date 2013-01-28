
var Message = require('../../model/message')
  , common = require('../../view/common');

var info = common.info;
var error = common.error;

module.exports = {
  browse: function browse(req, res) {
    var user = req.session.user;
    Message.latest(user.name, 10, function(err, messages) {
      if (err) {
        error(res, err, '/admin/messages/');
      } else {
        res.render('admin/message-browse-page', {
          user: user,
          messages: messages
        });
      }
    });
  },

  browseSent: function browseSent(req, res) {
    var user = req.session.user;
    Message.sent(user.name, 10, function(err, messages) {
      if (err) {
        error(res, err, '/admin/messages/');
      } else {
        res.render('admin/message-browse-sent-page', {
          user: user,
          messages: messages
        });
      }
    });
  },

  browseRecv: function browseRecv(req, res) {
    var user = req.session.user;
    Message.recv(user.name, 10, function(err, messages) {
      if (err) {
        error(res, err, '/admin/messages/');
      } else {
        res.render('admin/message-browse-recv-page', {
          user: user,
          messages: messages
        });
      }
    });
  },

  create: function create(req, res) {
    var user = req.session.user;
    var message = new Message({
      title: req.body.message.title,
      body: req.body.message.body,
      to: req.body.message.to,
      from: user.name,
      read: false
    });
    if (message.title && message.body && message.to) {
      message.save(function(err) {
        if (err) {
          error(res, err, '/admin/messages/');
        } else {
          info(res, '成功发送给' + message.to + '！', '/admin/messages/');
        }
      });
    } else {
      error(res, '参数错误！', '/admin/messages/');
    }
  },

  createView: function createView(req, res) {
    res.render('admin/message-edit-page', {
      title: '发送消息'
    });
  },

  detail: function detail(req, res) {
    Message.findOne({
      _id: req.params.id
    }, function(err, message) {
      message.read = true;
      message.save();
      res.render('admin/message-detail-page', {
        message: message
      });
    });
  },

  remove: function remove(req, res) {
    var id = req.params.id;
    Message.remove({
      _id: id
    }, function (err) {
      if (err) {
        error(res, err, '/admin/messages/');
      } else {
        info(res, '成功删除消息！', '/admin/messages/');
      }
    });
  }

}
