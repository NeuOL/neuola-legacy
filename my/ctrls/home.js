/*
 * The homepage of the neuol site.
 */

var SlidePic = require('../model/picture')
  , common = require('../view/common');

exports.index = function index(req, res) {
  SlidePic.list(3, function(err, slides) {
    if (err) {
      common.error(res, err, '/');
    } else {
      res.render('index', {
        title: 'Neuola',
        headPics: slides
      });
    }
  });
}

exports.about = function about(req, res) {
  res.render('about', {
    title: '关于'
  });
}

exports.noInterest = function noInterest(req, res) {
  res.render('no-interest', {
    title: '没兴趣？'
  });
}
