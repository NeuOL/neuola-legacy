var mongodb = require('../db');

function Post(post) {
  if (post) {
    this._id = post._id;
    this.title = post.title;
    this.body = post.body;
    this.author = post.author;
    this.state = post.state;
    this.date = post.date;
    this.catalog = post.catalog;
    this.url = post.url;
  }
}

module.exports = Post;

Post.list = function list(options, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.find(options).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);
        } else {
          var posts = [];
          docs.forEach(function(doc, index) {
            var post = new Post(doc);
            posts.push(post);
          });
          callback(err, posts);
        }
      });

    });
  });
};

Post.getByUrl = function getByUrl(catalog, url, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      callback(err);
    }

    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        callback(err);
      }

      collection.findOne({
        "$or": [{
          title: url,
          url: null
        }, {
          url: url
        }],
        catalog: catalog
      }, function(err, doc) {
        mongodb.close();
        if (err) {
          callback(err, null);
        } else {
          callback(err, new Post(doc));
        }
      });
    });
  });
};

Post.get = function get(catalog, article, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.findOne({
        title: article,
        catalog: catalog
      }, function(err, doc) {
        mongodb.close();
        if (doc) {
          var post = new Post(doc);
          callback(err, post);
        } else {
          callback(err, null);
        }
      });

    });
  });
}

Post.prototype.getUrl = function getUrl() {
  return this.url ? this.url : this.title;
};

Post.prototype.save = function save(callback) {
  var post = {
    title: this.title,
    body: this.body,
    author: this.author,
    date: this.date,
    state: this.state,
    catalog: this.catalog,
    url: this.url
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.ensureIndex({
        title: post.title,
        catalog: post.catalog,
        url: post.url
      }, {
        unique: true
      }, function(err) {
        callback(err);
      });

      collection.save(post, {
        safe: true
      }, function(err, doc) {
        mongodb.close();
        callback(err);
      });

    });

  });
}

Post.prototype.remove = function(callback) {
  var doc = {
    "_id": this._id,
  };
  console.log(doc);

  mongodb.open(function(err, db) {
    if (err) callback(err);
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove(doc, function(err, doc) {
        mongodb.close();
        callback(err, doc);
      });
    });
  });
};

