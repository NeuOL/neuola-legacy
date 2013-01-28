
var user = require('../my/ctrls/admin/user')
  , home = require('../my/ctrls/admin/home')
  , picture = require('../my/ctrls/admin/picture')
  , message = require('../my/ctrls/admin/message')
  , article = require('../my/ctrls/admin/article')
  ;

/**
 * URL patterns for the administration site.
 */
module.exports = function(app) {
  app.all('/admin/', user.checkLogin, home.index);

  app.get('/admin/login', user.loginView);
  app.post('/admin/login', user.login);

  app.all('/admin/logout', user.logout);

  app.get('/admin/register', user.registerView);
  app.post('/admin/register', user.register);

  // --- Article Module

  app.all('/admin/article/new', user.checkLogin);
  app.get('/admin/article/new', article.createView);
  app.post('/admin/article/new', article.create);
  
  app.all(/^\/admin\/article\/edit\/(.+)$/, user.checkLogin);
  app.get(/^\/admin\/article\/edit\/(.+)$/, article.updateView);
  app.post(/^\/admin\/article\/edit\/(.+)$/, article.update);

  app.all('/admin/article/del/:url', user.checkLogin);
  app.all('/admin/article/del/:url', article.remove);

  app.all('/admin/articles/', user.checkLogin);
  app.get('/admin/articles/', article.browse);

  app.all('/admin/articles/catalog/', user.checkLogin);
  app.get('/admin/articles/catalog/', article.catalog.home);
  app.post('/admin/articles/catalog/', article.catalog.action);

  app.all('/admin/articles/catalog/new', user.checkLogin);
  app.get('/admin/articles/catalog/new', article.catalog.createView);
  app.post('/admin/articles/catalog/new', article.catalog.create);

  app.get('/admin/articles/catalog/edit/:catalog', user.checkLogin, article.catalog.updateView);
  app.post('/admin/articles/catalog/edit/', user.checkLogin, article.catalog.update);

  app.get('/admin/articles/catalog/del/:catalog', user.checkLogin, article.catalog.remove);

  app.get('/admin/articles/catalog/view/:catalog', user.checkLogin, article.browse);

  // --- Picture Module

  app.get('/admin/pictures/', user.checkLogin, picture.browse);

  app.all('/admin/pictures/new', user.checkLogin);
  app.post('/admin/pictures/new', picture.create);
  app.get('/admin/pictures/new', picture.createView);

  app.all('/admin/pictures/update/', user.checkLogin);
  app.post('/admin/pictures/update/', picture.update);

  app.get('/admin/pictures/update/:pic', user.checkLogin, picture.updateView);

  app.get('/admin/pictures/del/:pic', user.checkLogin, picture.remove);

  // --- Users Management Module

  app.get('/admin/users/', user.checkLogin, user.browse);

  app.all('/admin/users/edit/:id', user.checkLogin);
  app.get('/admin/users/edit/:id', user.updateView);
  app.post('/admin/users/edit/:id', user.update);

  app.get('/admin/user/verify/:id', user.checkLogin, user.verify);

  // --- Messages Module

  app.get('/admin/messages/', user.checkLogin, message.browse);

  app.get('/admin/messages/sent', user.checkLogin, message.browseSent);
  app.get('/admin/messages/recv', user.checkLogin, message.browseRecv);

  app.all('/admin/messages/new/', user.checkLogin);
  app.get('/admin/messages/new/', message.createView);
  app.post('/admin/messages/new/', message.create);

  app.get('/admin/messages/view/:id', user.checkLogin, message.detail);

  app.get('/admin/messages/del/:id', user.checkLogin, message.remove);
  
};
