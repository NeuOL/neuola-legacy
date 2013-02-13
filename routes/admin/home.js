/*
 * The home controller for administration.
 */

var async = require('async')
var common = require('../../my/view/common');
var model = require('../../my/model');

exports.index = function index(req, res) {
  async.parallel({
    numOfUnread: function(callback) {
      var user = req.session.user;
      model.Message.count({
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
