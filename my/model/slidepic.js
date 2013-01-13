
var mongodb = require('../db');

function SlidePic(headPic) {
  this.src = headPic.src;
  this.title = headPic.title;
  this.description = headPic.description;
}

module.exports = SlidePic;

SlidePic.list = function list(num, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }

    db.collection('slides', function(err, collection) {
      if (err) {
        mongodb.close();
        callback(err);
      }
      collection.find().limit(num).toArray(function(err, docs) {
        mongodb.close()
        if (err) {
          callback(err, []);
        } else {
          var slides = [];
          docs.forEach(function (doc, index) {
            slides.push(new SlidePic(doc));
          });
          callback(err, slides);
        }
      });
    });
  });
}; 
