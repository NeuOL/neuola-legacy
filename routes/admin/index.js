
var user = require('./user')
  , home = require('./home')
  , article = require('./article');

/**
 * URL patterns for the administration site.
 */
module.exports = {
  all: user.checkLogin,
  all: home.index,

  'login': {
    get: user.loginView,
    post: user.login
  },

  'logout': {
    all: user.logout
  },

  'register': {
    get: user.registerView,
    post: user.register
  },

  'article/': {
    'new': {
      all: user.checkLogin,
      get: article.createView,
      post: article.create
    },
    'edit/:catalog/:url': {
      all: user.checkLogin,
      get: article.updateView,
      post: article.update
    },
    'del/:catalog/:url': {
      all: user.checkLogin,
      post: article.remove
    }
  },

  'articles': {
    all: user.checkLogin,
    get: article.browse
  },
  
  'catalog/': {
    all: user.checkLogin,
    post: article.changeCatalog,

    ':catalog': {
      all: user.checkLogin,
      post: article.browse
    }
  }
};
