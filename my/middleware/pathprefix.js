
/**
 * Prefix the path with provided parameter.
 *
 */

module.exports = function (basePath) {
  return function (req, res, next) {
    var rd = res.render;
    res.render = function (url, params) {
      if (! params) params = {};
      params.session = req.session;
      params._ = function (url) {
        return basePath + url;
      };
      rd.call(this, url, params);
    };
    var re = res.redirect;
    res.redirect = function (url) {
      re.call(this, basePath + url);
    }
    next();
  }
};
