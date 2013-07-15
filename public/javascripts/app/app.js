define(['./init', './views/main'], function(init, MainView){
  var app = {
    init: function () {
      this.mainView = new MainView();
      this.mainView.render();
    }
  };
  return app;
});