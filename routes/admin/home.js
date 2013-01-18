/*
 * The home controller for administration.
 */

var async = require('async'),
  Message = require('../../my/model/message');

exports.index = function index(req, res) {
  async.series({
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
