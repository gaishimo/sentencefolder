var _ = require('underscore'),
     spawn = require('child_process').spawn,
     config = require('config');

module.exports = {

  speak: function(req, res){
    var sentence = req.param('sentence');
    var speakCmd = config.speak.cmd;
    var espeak = spawn(speakCmd, [sentence, '--stdout'])
    var lame = spawn('lame', ['-']);
    var buffers = [], buffersLength = 0;

    res.writeHead(200, { 'Content-Type': 'audio/mpeg' });

    espeak.stdout.on('data', function(buffer){
      lame.stdin.write(buffer);
    });
    espeak.stdout.on('end', function(){
      lame.stdin.end();
    });

    lame.stdout.on('data', function(buffer){
      res.write(buffer);
    });

    lame.stdout.on('end', function(){
      res.end();
    });

  }

};