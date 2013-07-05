var _ = require('underscore'),
     spawn = require('child_process').spawn,
     config = require('config'),
     tags = require('../models/dao/tags_dao');

module.exports = {

  speak: function(req, res){
    var sentence = req.param('sentence');
    var speakCmd = config.speak.cmd;
    var espeak = spawn(speakCmd, [sentence, '--stdout'])
    var lame = spawn('lame', ['-']);


    res.writeHead(200, { 'Content-Type': 'audio/mpeg' });

    espeak.stdout.on('data', function(data){
      lame.stdin.write(data);
    });

    espeak.on('exit', function(){
      lame.stdin.end();
    });

    lame.stdout.on('data', function(data){
      res.write(data);
    });

    lame.on('exit', function(){
      res.end();
    });



  }

};