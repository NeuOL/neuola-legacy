
var home = require('../my/ctrls/home')
  , article = require('../my/ctrls/article');

/**
 * URL patterns for main site.
 */
module.exports = function(app) {
  app.get('/', home.index);
  app.get('/no-interest', home.noInterest);

  app.get('/about', home.about);

  app.get('/catalog/:catalog', article.catalog);
  app.get(/^\/article\/(.+)$/, article.article);
  app.get('/articles/', article.tag);

  require('./admin')(app);
};
