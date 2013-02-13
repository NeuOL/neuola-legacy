
var user = require('../user')
  , home = require('./home')
  , picture = require('./picture')
  , message = require('./message')
  , article = require('./article')
  ;

/**
 * URL patterns for the administration site.
 */
module.exports = {
  get: home.index,

  'article': {
    'new': {
      get: article.createView,
      post: article.create
    },
    'edit/:url': {
      get: article.updateView,
      post: article.update
    },
    'del/:url': {
      all: article.remove
    }
  },

  'articles': {
    get: article.browse,

    'catalog': {
      post: article.catalog.action,
      get: article.catalog.home,

      'new': {
        post: article.catalog.create,
        get: article.catalog.createView
      },

      'edit':{
        post: article.catalog.update,

        ':catalog': {
          get: article.catalog.updateView
        }
      },

      'del/:catalog': {
        get: article.catalog.remove
      },

      'view/:catalog': {
        get: article.browse
      }
    }
  },

  'pictures': {
    get: picture.browse,

    'new': {
      post: picture.create,
      get: picture.createView
    },

    'update': {
      post: picture.update,

      ':pic': {
        get: picture.updateView
      }
    },

    'del/:pic': {
      get: picture.remove
    },

  },

  'users': {
    get: user.browse,

    'edit/:id': {
      get: user.updateView,
      post: user.update
    },

    'verify/:id': {
      get: user.verify
    }
  },

  'messages': {
    get: message.browse,

    'sent': {
      get: message.browseSent
    },

    'recv': {
      get: message.browseRecv
    },

    'new': {
      get: message.createView,
      post: message.create
    },

    'view/:id': {
      get: message.detail,
    },

    'del/:id': {
      get: message.remove
    }
  }
};
