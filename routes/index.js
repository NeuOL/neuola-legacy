
/*
 * GET home page.
 */

var admin = require('./admin/')
  , home = require('./home')
  , article = require('./article');

exports.init = function init(app, pf) {
  app.all(pf, home.index);
  app.get(pf + 'no-interest', home.noInterest);

  app.all(pf + 'about', home.about);

  app.get(pf + 'catalog/:catalog', article.catalog);
  app.get(pf + 'article/:catalog/:article', article.article);

  admin.init(app, pf + 'admin/');
}

