/*
 * The home controller for administration.
 */

var async = require('async')
var Message = require('../../model/message');
var common = require('../../view/common');

exports.index = function index(req, res) {
  async.parallel({
    numOfUnread: function(callback) {
      var user = req.session.user;
      Message.count({
        read: false,
        from: {$ne: user.name}
      }, callback);
    }
  }, function(err, results) {
    res.render('admin/index', {
      title: '管理',
      user: req.session.user,
      numOfUnread: results.numOfUnread
    });
  });
};
