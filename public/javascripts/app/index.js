define([ './views/main', './init'], function(MainView, Router){

  if (window.ENV !== 'test'){
    var mainView = new MainView( { el: 'body' } );
    mainView.render();
  }
});


