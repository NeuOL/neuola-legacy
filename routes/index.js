
var adminRoutes = require('./admin/')
  , home = require('./home')
  , article = require('./article');

/**
 * URL patterns for main site.
 */
module.exports = {
  get: home.index,

  'no-interest': {
    get: home.noInterest
  },

  'about': {
    all: home.about
  },

  'catalog/:catalog': {
    get: article.catalog
  },
  'article/:article': {
    get: article.article
  },
  'articles/': {
    get: article.tag
  },

  'admin/': adminRoutes
};
