
/*
 * Routes for Administration
 */

var user = require('./user')
  , home = require('./home')
  , article = require('./article');

/*
 * Initialize the application with URL prefix.
 */
exports.init = function init(app, pf) {
  app.all(pf, home.index);

  app.get(pf + 'login', user.loginView);
  app.post(pf + 'login', user.login);

  app.all(pf + 'logout', user.logout);

  app.get(pf + 'register', user.registerView);
  app.post(pf + 'register', user.register);

  app.all(pf + 'article/new', user.checkLogin);
  app.get(pf + 'article/new', article.createView);
  app.post(pf + 'article/new', article.create);

  app.all(pf + 'article/edit/:catalog/:url', user.checkLogin);
  app.get(pf + 'article/edit/:catalog/:url', article.updateView);
  app.post(pf + 'article/edit/:catalog/:url', article.update);

  app.all(pf + 'article/del/:catalog/:url', user.checkLogin);
  app.post(pf + 'article/del/:catalog/:url', article.remove);

  app.all(pf + 'articles', user.checkLogin);
  app.get(pf + 'articles', article.browse);
};
