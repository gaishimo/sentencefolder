define(['backbone'],
    function(){
  var HeaderView = Backbone.View.extend({
    $el: $('#header'),
    render: function(){
      return this;
    }
  });
  return HeaderView;
});