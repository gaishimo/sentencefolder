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

    this.gotoEdit = function(editView){
      $('#list-container').fadeOut(500, function(){
        AppModel.getGeneralModel().trigger('hide_list_container');
        $('#main-content').append(editView.render().el);
        editView.doAfterViewShowed();
        $('body').animate({ scrollTop: 0 }, 10);
      });
    };

    TransitionHelper = function(){
      return instance;
    }
  };
  return new TransitionHelper();
});