
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
  if (req.body.user.name && req.body.user.pass && req.body.user.repass
      && req.body.user.pass == req.body.user.repass) {
    var user = new User(req.body.user);
    user.save(function (err) {
      if (! err) {
        res.render('done', {
          title: '完成',
          link: '/login',
          message: '已经成功登陆。'
        });
      } else {
        res.render('error', {
          title: '出错了！',
          link: '/register',
          message: err
        });
      }
    });
  } else {
    req.render('done', {
      link: '/login',
      message: '该用户已经完成注册。'
    });
  }
};

/*
 * The view for the login action.
 */
exports.loginView = function loginView(req, res) {
  res.render('admin/login', {title:'登陆'});
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
        message: 'Successfully login!',
        link: '/users'
      });
    } else {
      res.render('error', {
        message: 'Wrong username or password...',
        link: '/login'
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
    'link': '/login',
    'message': 'Successfully logout!'
  });
};

