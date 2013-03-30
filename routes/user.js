/*
 * The user module for administration.
 * Some code is reused in some organization.
 *
 * @author yfwz100
 */

var model = require('../my/model');
var common = require('../my/view/common');

/*
 * Check if the user has login or not.
 */
exports.checkLogin = function checkLogin(req, res, next) {
  if (! req.session.user) {
    return res.redirect('/user/login');
  } else {
    next();
  }
}

/*
 * Render the register page.
 */
exports.registerView = function registerView(req, res) {
  if (! req.session.user) {
    res.render('user/register', {
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
  var name = req.body.user.name;
  var password = req.body.user.pass;
  var rpass = req.body.user.rpass;
  var description = req.body.user.description;
  if (name && password && description && password == rpass) {
    /*
     * First check the parameters: user[name], user[pass], user[rpass]
     */
    var user = new model.User({
      name: name,
      password: password,
      verified: false,
      description: description
    });
    user.save(function(err) {
      if (!err) {
        common.info(res, '成功注册！请等候审核。', '/user/login');
      } else {
        common.error(res, err, '/user/register');
      }
    });
  } else {
    common.error(res, '参数错误！', '/user/register');
  }
};

/*
 * The view for the login action.
 */
exports.loginView = function loginView(req, res) {
  if (! req.session.user) {
    res.render('user/login', {
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
  model.User.get(username, function(err, user) {
    if (user && username == user.name && password == user.password && user.verified) {
      req.session.user = user.toJSON();
      req.session.user.loginDate = new Date;
      common.info(res, '成功登陆~', '/admin/');
    } else {
      var message = '用户名或密码错误！';
      if (user && ! user.verified) {
        message = '用户尚未激活。';
      }
      common.error(res, message, '/user/login');
    } 
  });
};

/*
 * The logout action.
 */
exports.logout = function logout(req, res) {
  req.session.user = null;
  common.info(res, '已经安全退出本系统。', '/user/login');
};

exports.browse = function browse(req, res) {
  model.User.find({}, function(err, users) {
    if (!err) {
      res.render('admin/user-browse-page', {
        title: '用户管理',
        users: users
      });
    } else {
      common.error(res, err, '/admin/');
    }
  });
};

exports.updateView = function updateView(req, res) {
  var id = req.params.id;
  model.User.findOne({
    _id: id
  }, function(err, user) {
    if (err) {
      common.error(res, err, '/admin/users/');
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
    updated.password = pass;
  }
  if (req.body.user.verified) {
    updated.verified = req.body.user.verified;
  }

  model.User.findOneAndUpdate({
    _id: id
  }, updated, function(err, user) {
    if (err) {
      common.error(res, err, '/admin/users');
    } else {
      if (id == req.session.user._id) {
        req.session.user = user;
      }
      common.info(res, '完成编辑！', '/admin/users/');
    }
  });
};

exports.verify = function verify(req, res) {
  var id = req.params.id;
  var updated = {};
  updated.verified = true;

  model.User.findOneAndUpdate({
    _id: id
  }, updated, function(err, user) {
    if (err) {
      common.error(res, err, '/admin/users/');
    } else {
      common.info(res, '完成激活！', '/admin/users/');
    }
  });
};

