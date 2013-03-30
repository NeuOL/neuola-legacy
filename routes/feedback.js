
/**
 * The feedback module.
 */
var model = require('../my/model')
  , common = require('../my/view/common');

var error = common.error
  , info = common.info;

exports.view = function (req, res) {
  res.render('feedback');
};

exports.submit = function (req, res) {
  var feedback = req.body.feedback;
  if (feedback && feedback.email && feedback.comment) {
    var fb = new model.Feedback({
      comment: feedback.comment,
      email: feedback.email,
    });
    fb.save(function(err) {
      if (err) {
        error(res, '不好意思，好像出了点问题……', '/');
      } else {
        info(res, '谢谢您的支持！', '/');
      }
    });
  } else {
    error(res, '参数错误！', '/');
  }
};
