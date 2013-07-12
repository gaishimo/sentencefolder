define([ './views/main', 'viewport', './init'], function(MainView, viewport){

  if (window.ENV !== 'test'){
    var mainView = new MainView( { el: 'body' } );
    mainView.render();

  }
});


