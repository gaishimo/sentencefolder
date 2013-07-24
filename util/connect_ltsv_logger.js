/*
The MIT License (MIT)
Copyright (c) 2013 Takeharu.Oshida

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var url     = require("url"),
    fs      = require("fs"),
    util    = require("util"),
    logger  = require("connect").logger,
    moment  = require("moment");

var ltsvTokens = [
  "time",
  "host",
  "X-Forwarded-For",
  "user",
  "ident",
  "req",
  "method",
  "uri",
  "protocol",
  "status",
  "size",
  "reqsize",
  "referer",
  "ua",
  "vhost",
  "reqtime",
  "X-Cache",
  "X-Runtime"
];

logger.token("time",function(){
  return "[" + moment().format("DD/MMM/YYYY:HH:mm:ss Z") + "]" ;
});

logger.token("host",function(req,res){
  var address = req.connection.address();
  return address ? address.address : '-';
});

logger.token("X-Forwarded-For",function(req,res){
  return res.getHeader("X-Forwarded-For") || "-";
});

logger.token("user",function(req,res){
  return '-';
});

logger.token("ident",function(req,res){
  return '-';
});

logger.token("req",function(req,res){
  var ret = [];
  ret.push(req.method);
  ret.push(req.url);
  ret.push("HTTP/"+req.httpVersion);
  return ret.join(" ");
});

logger.token("method",function(req,res){
  return req.method;
});

logger.token("uri",function(req,res){
  return url.parse(req.url).href;
});

logger.token("protocol",function(req,res){
  return url.parse(req.url).protocol;
});

logger.token("status",function(req,res){
  return res.statusCode;
});

logger.token("size",function(req,res){
  return res.getHeader("content-length");
});

logger.token("reqsize",function(req,res){
  if(req.body) return req.body.length;
  return "-";
});

logger.token("referer",function(req,res){
  return req.headers['referer'] || req.headers['referrer'];
});

logger.token("ua",function(req,res){
  return req.headers['user-agent'];
});

logger.token("vhost",function(req,res){
  return req.headers["host"];
});

logger.token("reqtime",function(req,res){
  return new Date - req._startTime;;
});

logger.token("X-Cache",function(req,res){
  return res.getHeader('X-Cache');
});

logger.token("X-Runtime",function(req,res){
  return res.getHeader('X-Runtime');
});

//override connect.logger's format as ltsv
/**
 * Default format.
 */
var defaultFmt = [];
defaultFmt.push("host::remote-addr");
defaultFmt.push("ident:-");
defaultFmt.push("user:-");
defaultFmt.push("time:[:date]");
defaultFmt.push("req::method :url HTTP/:http-version");
defaultFmt.push("status::status");
defaultFmt.push("size::res[content-length]");
defaultFmt.push("referer::referrer");
defaultFmt.push("ua::user-agent");
logger.format('default',defaultFmt.join("\t"));

/**
 * Short format.
 */
var shortFmt = [];
shortFmt.push("host::remote-addr");
shortFmt.push("ident:-");
shortFmt.push("req::method :url HTTP/:http-version");
shortFmt.push("status::status");
shortFmt.push("size::res[content-length]");
shortFmt.push("response-time::response-time ms");
logger.format('short',shortFmt.join("\t"));

/**
 * Tiny format.
 */
var tinyFmt = [];
tinyFmt.push("req::method :url");
tinyFmt.push("status::status");
tinyFmt.push("size::res[content-length]");
tinyFmt.push("response-time::response-time ms");
logger.format('tiny',tinyFmt.join("\t"));

function setFormat(arr){
  var i,len,fmt = [];
  for(i = 0,len = arr.length;i < len;i++){
    if (ltsvTokens.indexOf (arr[i])>=0){
      fmt.push(arr[i] + "::" +arr[i]);
    }
  }
  logger.format("ltsv",fmt.join("\t"));
}

module.exports = function ltsvLogger(options){
  var toString = Object.prototype.toString;
  var typeOf = function(that){
    var t = toString.call(that);
    return t.split(" ")[1].replace("]","");
  };
  if (typeOf(options) === "Object") {
    options = options;
    if (typeOf(options.format) === "Array") {
      setFormat(options.format);
      options.format = "ltsv";
    }
  } else if (typeOf(options) === "Array") {
    setFormat(options);
    options.format = "ltsv";
  } else if (typeOf(options) === "String") {
    options = { format: options };
  } else {
    options = {};
  }
  return logger(options);
};
