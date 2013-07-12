'use strict';

define([ '../router', './filter-form',  './list-operate-panel' ,'backbone'],
    function(Router, FilterFormView, ListOperatePanelView){

  var ListHeaderView = Backbone.View.extend({
    render: function(){
      this.filterFormView = new FilterFormView({
        collection: this.collection
      });
      this.listOperatePanelView = new ListOperatePanelView({
        collection: this.collection
      });
      this.$el.append(
        this.filterFormView.render().el,
        this.listOperatePanelView.render().el
      );
      this.filterFormView.setRangeSlider();
      this.filterFormView.setSelect2();

      Router.initialize(this.filterFormView);
      return this;
    }
  });
  return ListHeaderView;
});