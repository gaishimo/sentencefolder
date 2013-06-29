define([
  '../models/app_model',
  '../views/study-item-edit',
  '../views/studying'
  ],
  function(AppModel, StudyItemEditView, StudyingView){

  //singleton
  var TransitionHelper = function(){
    var instance = this;

    this.gotoEdit = function(model){
      var editView = new StudyItemEditView({ model: model });
      $('#list-container').fadeOut(500, function(){
        AppModel.getGeneralModel().trigger('hide_list_container');
        $('#main-content').append(editView.render().el);
        editView.doAfterViewShowed();
        $('body').animate({ scrollTop: 0 }, 10);
        // $('.basic .question-text').focus();
      });
    };

    this.gotoStudy = function(items){
      var studyingView = new StudyingView({ collection: items });
      $('#list-container').fadeOut(500, function(){
        AppModel.getGeneralModel().trigger('hide_list_container');
        $('#main-content').append(studyingView.render().el);
        $('body').animate({ scrollTop: 0 }, 10);
        studyingView.showNextItem();
      });
    };

    TransitionHelper = function(){
      return instance;
    }
  };
  return new TransitionHelper();
});