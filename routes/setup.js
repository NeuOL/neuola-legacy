
/**
 * The initialization module for Neuola.
 *
 */

var model = require('../my/model')
  , async = require('async')
  ;

module.exports = function (req, res) {
  model.User.find({role:0}).count(function (err, count) {
    if (count == 0) {
      function catalog(meta) {
        var c = new model.Catalog(meta);
        return function (callback) {
          c.save(callback);
        };
      }
      var tasks = {
        admin: function (callback) {
          var admin = new model.User({
            name: 'admin',
            password: 'admin',
            role: 0,
            description: '高级管理员',
            verified: true
          });
          admin.save(function (err) {
            if (err) {
              res.render('res');
            }
          });
        },
        catalogExplore: catalog({
          name: '精选',
          description: '发现这个世界的故事。',
          id: 'explore'
        }),
        catalogActivities: catalog({
          name: '活动',
          description: '正在进行的活动。',
          id: 'news'
        })
      };
      async.parallel(tasks, function (err, result) {
        if (err) {
          res.render('error', {
            message: '初始化错误！',
            link: '/'
          });
        } else {
          res.render('info', {
            message: '初始化成功！',
            link: '/'
          });
        }
      });
    } else {
      res.render('error', {
        message: 'Nothing',
        link: '/'
      });
    }
  });
};
