var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  title: String,
  body: String,
  date: Date,
  read: Boolean
});

messageSchema.statics.unread = function unread(user, callback) {
  this.find({
    read: false,
    from: {
      $not: user
    }
  }, callback);
};

messageSchema.statics.latest = function latest(user, num, callback) {
  this.find({
    $or: [{
      to: user
    }, {
      from: user
    }],
  }).sort({
    date: -1
  }).limit(num).exec(callback);
};

messageSchema.statics.sent = function sent(user, num, callback) {
  this.find({
    from: user
  }).sort({
    date: -1
  }).limit(num).exec(callback);
};

messageSchema.statics.recv = function recv(user, num, callback) {
  this.find({
    to: user
  }).sort({
    date: -1
  }).limit(num).exec(callback);
};

module.exports = mongoose.model('message', messageSchema);
