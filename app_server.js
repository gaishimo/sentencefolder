var express = require('express'),
      partials = require('express-partials'),
      ejs_locals = require('ejs-locals'),
      http = require('http'),
      path = require('path'),
      fs = require('fs'),
      config = require('config'),
      RedisStore = require('connect-redis')(express),
      redis = require('redis').createClient(),
      _ = require('underscore'),
      ltsvlogger = require('./util/connect_ltsv_logger'),
      spawn = require('child_process').spawn,
      request = require('request'),
      device = require('express-device'),
      basicAuth = config.basicAuth,
      index = require('./controllers/index_controller'),
      login = require('./controllers/login_controller'),
      sentence = require('./controllers/sentence_controller');
      tag = require('./controllers/tag_controller'),
      speak = require('./controllers/speak_controller');

module.exports = function(){
  var server;
  return {
    run: function(port,callback){
      var app = express();

      app.configure('development', 'testing', 'prototype', function(){
        app.use(express.logger('dev')); //stdout
        app.use( express.errorHandler(
          { dumpExceptions: true, showStack: true }
        ));
      });

      app.configure('production', function(){
      });

      app.configure(function(){
        app.set('port', port || 3000);

        if(basicAuth){
          app.use(express.basicAuth(function(user, pass){
            return user ===basicAuth.username &&
               pass ===basicAuth.password;
          }));
        }

        app.set('views', __dirname + '/views');

        app.set('view engine', 'ejs');
        app.set('template_engine', 'ejs');
        app.set('view cache');


        app.set('secret key', 'mySecret');
        app.set('cookie session key', 'sid');

        app.engine('ejs', ejs_locals);

        app.use(express.favicon());
        app.use(ltsvlogger({
            format: [ 'host', 'ident', 'user', 'time', 'req',
              'status', 'size', 'referer', 'ua'],
            stream: fs.createWriteStream("logs/ltsv-access.log",{flags: 'a+'})
          }
        ));

        app.use(express.static(path.join(__dirname, 'public')));

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser(app.get('secret key')));

        app.use(device.capture());
        app.enableDeviceHelpers();
        app.use(function(req, res, next){
          res.locals.tooltip_class = function(){
            return res.locals.is_desktop ? 'tooltip': '';
          }
          next();
        });

        app.use(express.session(
          {
              key: app.get('cookie session key'),
              cookie: {maxAge: 1000 * 60 * 60 * 4}, //default : 4 hours
              store: new RedisStore({
                  host: config.db.redis_session.host,
                  port: config.db.redis_session.port,
                  db: config.db.redis_session.database_index,
                  pass: config.db.redis_session.password,
                  client: redis
              })
          }
        ));
        app.use(express.session());

        app.use(checkAuth);

        app.use(partials());
        app.use(app.router);

      });

      app.get('/', index);
      app.get('/login', login.index);
      app.post('/login', login.login);
      app.get('/logout', login.logout);

      app.get('/sentences', sentence.list);
      app.get('/sentences/cnt', sentence.count);
      app.post('/sentences/new', sentence.create);
      app.patch('/sentences/:id', sentence.update);
      app.delete('/sentences/:id', sentence.delete);

      app.get('/tags', tag.list);

      app.get('/speak', speak.speak);


      server = http.createServer(app);
      server.listen(app.get('port'), function(){

        console.log("Express server listening on port " + app.get('port'));
        if(callback){
          callback();
        }
      });
    },

    stop: function(){
      server.close();
    }

  };
};

function checkAuth(req, res, next){
  var notNeedAuthUrls = [
      '/login',
      '/logout'
    ];
  var needAuth = true;
  notNeedAuthUrls.forEach(function( url ){
      if( _.isRegExp(url) ){
          if( req.url.match(url) ){ needAuth = false; }
      }else{
        if( req.url === url ){ needAuth = false; }
      }
  });

  if( !needAuth ){ next(); return; }

  // console.log("req.user", req.user);
  // console.log("req.session", req.session);

  if(!req.session.user){
    res.redirect('/login');
    return;
  }
  next();
}



