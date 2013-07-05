define([ './views/main', './init'], function(MainView){
  if (window.ENV !== 'test'){
    var mainView = new MainView( { el: 'body' } );
    mainView.render();

  }
});


