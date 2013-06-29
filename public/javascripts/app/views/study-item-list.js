define(['../collections/sentences', './list', 'backbone', 'bottom'],
    function(SentenceCollection, ListView ){
  'use strict';
  var StudyItemListView = ListView.extend({

    initialize: function(){
      var self = this;
      ListView.prototype.initialize.call(this);
    },

    setSliders: function(){
      var views = this.views;
      this.collection.each(function (model) {
        var view = views[model.cid];
        view.setSlider();
      });
    }

  });
  return StudyItemListView;
});
