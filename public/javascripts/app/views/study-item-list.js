define(['../collections/sentences', './list', 'backbone'],
    function(SentenceCollection, ListView ){
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
