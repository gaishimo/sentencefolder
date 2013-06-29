define(['./init', './views/main'], function(MainView){
  'use strict';
  var app = {
    init: function () {
      this.mainView = new MainView();
      this.mainView.render();
    }
  };
  return app;
});