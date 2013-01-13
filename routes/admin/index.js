
/*
 * Routes for Administration
 */

var user = require('./user')
  , home = require('./home');

/*
 * Initialize the application with URL prefix.
 */
exports.init = function init(app, pf) {
  app.all(pf, home.index);

  app.get(pf + 'login', user.loginView);
  app.post(pf + 'login', user.login);

  app.all(pf + 'logout', user.logout);
};
