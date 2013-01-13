
/*
 * The home controller for administration.
 */

exports.index = function index(req, res) {
  res.render('admin/index', {title: '管理'});
};
