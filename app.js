/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  setting = require('./my/settings'),
  http = require('http'),
  path = require('path'),
  MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(setting.cookieSecret));
  app.use(express.session({
    secret: setting.cookieSecret,
    store: new MongoStore({
      db: setting.mongo.db
    })
  }));
  app.use(app.router);
  app.use(require('less-middleware')({
    src: __dirname + '/public'
  }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.map = function(a, route) {
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      case 'object':
        if (key.charAt(0) != '/') {
          app.map(a[key], route + key);
        } else {
          app.map(a[key], key);
        }
        break;
      case 'function':
        app[key](route, a[key]);
        break;
    }
  }
};
//routes.init(app, '/');
app.map({
  '/': routes
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
