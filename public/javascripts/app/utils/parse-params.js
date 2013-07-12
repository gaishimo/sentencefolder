define([],function(){
  var re = /([^&=]+)=?([^&]*)/g;
  var decode = function(str) {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  };
  var parseParams = function(query) {
    var params = {}, e;
    if (query) {
      if (query.substr(0, 1) == '?') {
        query = query.substr(1);
      }

      while (e = re.exec(query)) {
        var k = decode(e[1]);
        var v = decode(e[2]);
        params[k] = v;
      }
    }
    return params;
  };
  return parseParams;
});