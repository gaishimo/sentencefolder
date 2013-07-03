define(['../collections/sentences', '../collections/tags', 'backbone'],
  function(SentenceCollection, TagsCollection){

  //singleton
  var AppModel = function(){
    var instance = this;

    var sentenceList = new SentenceCollection([]);
    var tagList = new TagsCollection();
    var generalModel = new Backbone.Model();
    var filterModel = new Backbone.Model();

    this.getSentenceList = function(){
      return sentenceList;
    };

    this.setSentenceList = function(list){
      sentenceList = list;
    };

    tagList.comparator = function(tag){ return tag.get('tag_id'); };
    tagList.fetch();

    this.getTagList = function(){
      return tagList;
    };

    this.addTagList = function(tags){
      tagList.add(tags);
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