define([
  '../models/app_model'
  ],
  function(AppModel){

  //singleton
  var TransitionHelper = function(){

    var instance = this;

    this.comeBackToList = function(currentVIew, callback){
      currentVIew.$el.fadeOut(300, function(){
        currentVIew.remove();
        $('#list-container').fadeIn(function(){
          AppModel.getGeneralModel().trigger('show_list_container');
          if(callback){ callback(); }
        });
      });
    };

    TransitionHelper = function(){
      return instance;
    }
  };
  return new TransitionHelper();
});