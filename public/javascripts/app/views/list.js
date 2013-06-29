define(['backbone'],
    function(){
  'use strict';

  var ListView = Backbone.View.extend({
    initialize: function () {
      this.views = {};
      this.listenTo(this.collection, {
        add: this.addModel,
        sort: this.sortModels,
        remove: this.removeModel,
        reset: this.resetModels
      });
      this.collection.each(this.addModel, this);
    },

    addModel: function (model) {
      this.$el.append((this.views[model.cid] = new this.options.modelView({
        collection: this.collection,
        model: model
      })).render().el);
      this.views[model.cid].setSlider();
    },

    sortModels: function () {
      var views = this.views;
      var $el = this.$el;
      var $models = $el.children();
      this.collection.each(function (model, i) {
        var view = views[model.cid];
        if (!view) return;
        var el = view.el;
        if (!$models[i]) {
          $el.append(el);
        } else if ($models[i] !== el) {
          $models.eq(i).before(el);
          $models = $($models.get().splice(i, 0, el));
        }
      });
    },

    removeModel: function (model) {
      var self = this;
      var view = self.views[model.cid];
      view.$el.fadeOut(1000, function(){
        view.remove();
        delete self.views[model.cid];
      });
    },

    resetModels : function(){
      var self = this;
      _.map(this.views, function(view, key){
        view.$el.fadeOut(500, function(){
          view.remove();
          delete self.views[key];
        });
      });
    }

  });
  return ListView;
});
