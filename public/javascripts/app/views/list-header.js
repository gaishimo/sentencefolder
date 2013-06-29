define(['./filter-form', './list-operate-panel' ,'backbone'],
    function(FilterFormView, ListOperatePanelView){
  'use strict';
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
      return this;
    }
  });
  return ListHeaderView;
});