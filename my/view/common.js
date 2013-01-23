
module.exports = {
  error: function error(res, message, link) {
    res.render('error', {
      message: message,
      link: link
    });
  },

  info: function info(res, message, link) {
    res.render('done', {
      message: message,
      link: link
    });
  }
};
