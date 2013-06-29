define(['backbone'],
    function(){
  'use strict';
  var HeaderView = Backbone.View.extend({
    $el: $('#header'),
    render: function(){
      return this;
    }
  });
  return HeaderView;
});