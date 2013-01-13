
/*
 * GET home page.
 */

var home = require('./home')
  , article = require('./article');

exports.init = function init(app) {
  app.all('/', home.index);
  app.get('/no-interest', home.noInterest);

  app.all('/about', home.about);

  app.get('/catalog/:catalog', article.catalog);
  app.get('/article/:catalog/:article', article.article);
}

