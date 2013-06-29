var piping = require('piping'),
      config = require('config'),
      app_server = require("./app_server"),
      port = config.port,
      server;

var runServer = function(port){
  server = app_server();
  server.run(port);
};

if(config.piping){
  if(piping( { ignore: /(\/\.|~$|\.log|package\.json|public\/|views\/)/ } )){
    server = app_server();
    server.run(port);
  }
}else{
  // not use piping in production
  server = app_server();
  server.run(port);
}

process.on('uncaughtException', function (err) {
  console.error('uncaughtException => ' + err.stack);
});