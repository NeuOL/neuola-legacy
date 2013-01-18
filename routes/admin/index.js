
var user = require('./user')
  , home = require('./home')
  , picture = require('./picture')
  , message = require('./message')
  , article = require('./article');

/**
 * URL patterns for the administration site.
 */
module.exports = {
  all: user.checkLogin,
  get: home.index,

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
      all: article.remove
    }
  },

  'articles/': {
    all: user.checkLogin,
    get: article.browse,

    'catalog/': {
      all: user.checkLogin,
      post: article.catalog.action,
      get: article.catalog.home,

      'new': {
        all: user.checkLogin,
        post: article.catalog.create,
        get: article.catalog.createView
      },

      'edit/':{
        post: article.catalog.update,

        ':catalog': {
          all: user.checkLogin,
          get: article.catalog.updateView
        }
      },

      'del/:catalog': {
        all: user.checkLogin,
        get: article.catalog.remove
      },

      'view/:catalog': {
        all: user.checkLogin,
        get: article.browse
      }
    }
  },

  'pictures/': {
    all: user.checkLogin,
    get: picture.browse,

    'new/': {
      all: user.checkLogin,
      post: picture.create,
      get: picture.createView
    },

    'update/': {
      all: user.checkLogin,
      post: picture.update,

      ':pic': {
        all: user.checkLogin,
        get: picture.updateView
      }
    },

    'del/:pic': {
      all: user.checkLogin,
      get: picture.remove
    },

    'view/': {
    }
  },

  'users/': {
    all: user.checkLogin,
    get: user.browse,

    'edit/:id': {
      all: user.checkLogin,
      get: user.updateView,
      post: user.update
    },

    'verify/:id': {
      all: user.checkLogin,
      get: user.verify
    }
  },

  'messages/': {
    all: user.checkLogin,
    get: message.browse,

    'sent/': {
      all: user.checkLogin,
      get: message.browseSent
    },

    'recv': {
      all: user.checkLogin,
      get: message.browseRecv
    },

    'new/': {
      all: user.checkLogin,
      get: message.createView,
      post: message.create
    },

    'view/:id': {
      all: user.checkLogin,
      get: message.detail,
    },

    'del/:id': {
      all: user.checkLogin,
      get: message.remove
    }
  }
  
};
