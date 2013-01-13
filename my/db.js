
/*
 * The database connection object.
 */

var setting = require('./settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new Db(
  setting.mongo.db, 
  new Server(setting.mongo.host, Connection.DEFAULT_PORT, {}),
  {w: 0}
);
