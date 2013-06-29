window.jQuery(function () {
  console.log("test.js");
  var module = window.module;
  var _ = window._;
  var app = window.app;
  var ok = window.ok;
  var test = window.test;
  var equal = window.equal;
  var deepEqual = window.deepEqual;


  module('node prototype', {
    setup: function(){}
  });

  test('simple test', function(){
    equal(1+1, 2);
  });

});
