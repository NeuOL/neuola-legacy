/*
 * The user module for administration.
 * Some code is reused in some organization.
 *
 * @author yfwz100
 */

var User = require('../../my/model/user');

/*
 * Check if the user has login or not.
 */
exports.checkLogin = function checkLogin(req, res) {
  return req.session.user != null;
}

/*
 * Render the register page.
 */
exports.registerView = function registerView(req, res) {
  res.render('admin/register', {
    title: '注册'
  });
};

/*
 * The register action.
 */
exports.register = function register(req, res) {
  if (req.body.user.name && req.body.user.pass && req.body.user.rpass && req.body.user.pass == req.body.user.rpass) {
    /*
     * First check the parameters: user[name], user[pass], user[rpass]
     */
    var user = new User(req.body.user);
    user.save(function(err) {
      if (!err) {
        res.render('done', {
          title: '完成',
          link: '/admin/login',
          message: '已经成功登陆。'
        });
      } else {
        res.render('error', {
          title: '出错了！',
          link: '/admin/register',
          message: err
        });
      }
    });
  } else {
    res.render('error', {
      title: '出错了！',
      link: '/admin/register',
      message: '参数错误。'
    });
  }
};

/*
 * The view for the login action.
 */
exports.loginView = function loginView(req, res) {
  res.render('admin/login', {
    title: '登陆'
  });
};

/*
 * The login processor.
 */
exports.login = function login(req, res) {
  var username = req.body.user.name;
  var password = req.body.user.pass;
  User.get(username, function(err, user) {
    if (user && username == user.name && password == user.password) {
      req.session.user = user;
      res.render('done', {
        title: '登陆成功！',
        message: '成功登陆~',
        link: '/admin/'
      });
    } else {
      res.render('error', {
        title: '错误!',
        message: '用户名或密码错误。',
        link: '/admin/register'
      });
    }
  });
};

/*
 * The logout action.
 */
exports.logout = function logout(req, res) {
  req.session.user = null;
  res.render('done', {
    title: '成功退出',
    link: '/admin/login',
    message: '已经安全退出本系统。'
  });
};
