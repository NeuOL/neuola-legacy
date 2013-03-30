
var mongoose = require('mongoose');

/**
 *
 * The feedback model
 *
 *  - email
 *  - comment (should be markdown syntax)
 *  - date
 *  - read
 *
 */

var feedbackSchema = new mongoose.Schema({
  email: String,
  comment: String,
  date: {
    type: Date,
    'default': Date.now
  },
  read: {
    type: Boolean,
    'default': false
  }
});

// Translate the markdown syntax to html syntax.
feedbackSchema.virtual('html').get(function () {
  return require('marked')(this.comment);
});

module.exports = mongoose.model('feedback', feedbackSchema);

