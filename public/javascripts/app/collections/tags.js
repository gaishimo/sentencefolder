'use strict';

define([  'backbone'], function(){
  var TagsCollection = Backbone.Collection.extend({
    model: Backbone.Model.extend({ idAttribute: 'tag_id' }),
    url: 'tags'
  });
  TagsCollection.prototype.add= function(newModel){
    var isDupe = this.any(function(model) {
      return model.get('tag_id') === newModel.get('tag_id');
    });
    if (isDupe) return;
    Backbone.Collection.prototype.add.call(this, newModel);
  };

  return TagsCollection;
});
