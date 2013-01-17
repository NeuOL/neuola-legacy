
/*
 * The settings about the site.
 */

module.exports = {
  cookieSecret: "neuola",
  mongo: {
    connection: require('./mongoose'),
    db: "qing",
    host: "localhost"
  }
};
  
