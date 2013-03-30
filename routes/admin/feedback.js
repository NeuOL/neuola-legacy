
/**
 * The routes of feedback management.
 */

var async = require('async');
var model = require('../../my/model')
  , common = require('../../my/view/common');

var error = common.error
  , info = common.info;

exports.browse = function (req, res) {
  var pageNo = req.param('page');
  var itemsPerPage = 10;
  if (pageNo) {
    pageNo = 0;
  }

  async.parallel({
    feedbacks: function (callback) {model.Feedback
      .find()
      .skip(pageNo*itemsPerPage).limit(itemsPerPage)
      .exec(callback);
    },
    items: function (callback) {
      model.Feedback.count(callback);
    }
  }, function (err, result) {
    if (err) {
      error(res, err, '/admin');
    } else {
      res.render('admin/feedback-browse-page', {
        title: '反馈列表',
        feedbacks: result.feedbacks,
        pages: result.items/itemsPerPage+1,
        page: pageNo
      });
    }
  });
  
};

exports.del = function (req, res) {
  var id = req.param('id');
  model.Feedback.remove({_id: id}, function (err) {
    if (err) {
      error(res, err, '/admin');
    } else {
      info(res, err, '/admin/feedbacks');
    }
  });
};
