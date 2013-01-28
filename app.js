/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , setting = require('./my/settings')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express);

var app = express();
var basePath = '/neuola';

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/public/uploads/'
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser(setting.cookieSecret));
  app.use(express.session({
    secret: setting.cookieSecret,
    store: new MongoStore({
      db: setting.mongo.db
    })
  }));
  // inject path prefix function _ into view.
  app.use(require('./my/middleware/pathprefix')(basePath));
  app.use(basePath, app.router);
  app.use(basePath, require('less-middleware')({
    src: __dirname + '/public'
  }));
  app.use(basePath, express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

