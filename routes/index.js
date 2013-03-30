
var home = require('./home')
  , article = require('./article')
  , user = require('./user')
  , feedback = require('./feedback')
  ;

/**
 * URL patterns for main site.
 */
module.exports = {
  all: home.index,

  'catalog/:catalog': {
    get: article.catalog
  },
  'article/*': {
    get: article.article
  },
  'articles': {
    get: article.tag
  },

  'about': {
    all: home.about
  },

  'user': {
    'register': {
      get: user.registerView,
      post: user.register
    },
    'login': {
      get: user.loginView,
      post: user.login
    },
    'logout': {
      all: user.logout
    },
  },

  'feedback': {
    get: feedback.view,
    post: feedback.submit
  },

  'admin(*)': {
    all: user.checkLogin,
  },
  'admin': require('./admin/'),

  'setup': {
    all: require('./setup')
  }
};

