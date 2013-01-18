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
exports.checkLogin = function checkLogin(req, res, next) {
  if (! req.session.user) {
    return res.redirect('/admin/login');
  } else {
    next();
  }
}

/*
 * Render the register page.
 */
exports.registerView = function registerView(req, res) {
  if (! req.session.user) {
    res.render('admin/register', {
      title: '注册'
    });
  } else {
    res.render('admin/user-edit-page', {
      title: '添加新用户'
    });
  }
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
    user.verified = false;
    user.save(function(err) {
      if (!err) {
        res.render('done', {
          title: '完成',
          link: '/admin/login',
          message: '成功注册！请等候审核。'
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
  if (! req.session.user) {
    res.render('admin/login', {
      title: '登陆'
    });
  } else {
    res.redirect('/admin/');
  }
};

/*
 * The login processor.
 */
exports.login = function login(req, res) {
  var username = req.body.user.name;
  var password = req.body.user.pass;
  User.get(username, function(err, user) {
    if (user && username == user.name && password == user.password && user.verified) {
      req.session.user = user.toJSON();
      req.session.user.loginDate = new Date;
      res.render('done', {
        title: '登陆成功！',
        message: '成功登陆~',
        link: '/admin/'
      });
    } else {
      var message = '用户名或密码错误！';
      if (! user.verified) {
        message = '用户尚未激活。';
      }
      res.render('error', {
        title: '错误!',
        message: message,
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

exports.browse = function browse(req, res) {
  User.find({}, function(err, users) {
    if (!err) {
      res.render('admin/user-browse-page', {
        title: '用户管理',
        users: users
      });
    } else {
      res.render('error', {
        message: err,
        link: '/admin/'
      });
    }
  });
};

exports.updateView = function updateView(req, res) {
  var id = req.params.id;
  User.findOne({
    _id: id
  }, function(err, user) {
    if (err) {
      res.render('error', {
        message: err,
        link: '/admin/users/'
      });
    } else {
      res.render('admin/user-edit-page', {
        actionUrl: '/admin/users/edit/' + id,
        title: '正在编辑用户“' + user.name + '”',
        user: user
      });
    }
  });
};

exports.update = function update(req, res) {
  var id = req.params.id;
  var pass = req.body.user.pass;
  var rpass = req.body.user.rpass;
  var updated = {
    name: req.body.user.name,
    description: req.body.user.description
  };
  if (pass == rpass) {
    updated.pass = pass;
  }
  if (req.body.user.verified) {
    updated.verified = req.body.user.verified;
  }

  User.findOneAndUpdate({
    _id: id
  }, updated, function(err, user) {
    if (err) {
      res.render('error', {
        message: err,
        link: '/admin/users/'
      });
    } else {
      if (id == req.session.user._id) {
        req.session.user = user;
      }
      res.render('done', {
        message: '完成编辑！',
        link: '/admin/users/'
      });
    }
  });
};

exports.verify = function verify(req, res) {
  var id = req.params.id;
  var updated = {};
  if (req.body.user.verified) {
    updated.verified = req.body.user.verified;
  }

  User.findOneAndUpdate({
    _id: id
  }, updated, function(err, user) {
    if (err) {
      res.render('error', {
        message: err,
        link: '/admin/users/'
      });
    } else {
      res.render('done', {
        message: '完成激活！',
        link: '/admin/users/'
      });
    }
  });
};

