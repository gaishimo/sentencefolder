require([ 'jquery', './views/main', './init'], function(jquery, MainView){

  if (window.ENV !== 'test'){
    var mainView = new MainView( { el: 'body' } );
    mainView.render();
  }
});


