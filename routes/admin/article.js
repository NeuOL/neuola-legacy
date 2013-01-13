/*
 * The article controller for administration
 */

var Post = require('../../my/model/post');

/*
 * The view of the create action.
 * @see #create()
 */
exports.createView = function createView(req, res) {
  res.render('admin/create-article', {
    title: '创建新文章'
  });
};

/*
 * The create action
 */
exports.create = function create(req, res) {
  if (req.body.post.title && req.body.post.body && req.body.post.catalog && req.session.user) {
    var doc = {
      title: req.body.post.title,
      body: req.body.post.body,
      catalog: req.body.post.catalog,
      author: req.session.user.name,
      date: new Date(),
      url: req.body.url ? req.body.url : req.body.post.title
    };
    console.log(doc);

    var post = new Post(doc);
    post.save(function(err) {
      if (err) {
        res.render('error', {
          title: '出错了',
          message: '保存错误：' + err,
          link: '/admin/article/new'
        });
      } else {
        res.render('done', {
          title: '完成',
          message: '保存成功！',
          link: '/admin/'
        });
      }
    });
  } else {
    res.render('error', {
      title: '错误参数',
      message: '错误参数！',
      link: '/admin/'
    });
  }
};

/*
 * Delete the action by URL.
 */
exports.remove = function remove(req, res) {};

/*
 * The view for update action.
 * @see #update()
 */
exports.updateView = function updateView(req, res) {};

/*
 * The update action.
 */
exports.update = function update(req, res) {};

/*
 * Browse all the records
 */
exports.browse = function browse(req, res) {};
