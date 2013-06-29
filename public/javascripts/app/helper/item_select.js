define([], function(){

  //singleton
  var ItemSelectHelper = function(){
    var instance = this;

    this.getSelectedModels = function(collection){
      var models = [];
      $('.study-item .item-select[data-checked=true]').each(function(i, item){
        var id = $(item).closest('li').attr('data-id');
        models.push( collection.get(id) );
      });
      return models;
    };

    ItemSelectHelper = function(){
      return instance;
    }
  };
  return new ItemSelectHelper();
});