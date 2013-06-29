define(['../collections/sentences', 'backbone'],
  function(SentenceCollection){

  //singleton
  var AppModel = function(){
    var instance = this;

    var sentenceList = new SentenceCollection([]);
    var generalModel = new Backbone.Model();
    var filterModel = new Backbone.Model();

    this.getSentenceList = function(){
      return sentenceList;
    };

    this.setSentenceList = function(list){
      sentenceList = list;
    };

    this.getGeneralModel = function(){
      return generalModel;
    };

    this.setFilterModel = function(model){
      filterModel = model;
    };

    this.getFilterModel = function(){
      return filterModel;
    };

    AppModel = function(){
      return instance;
    }
  };
  return new AppModel();
});