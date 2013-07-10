define([ './modal', 'backbone'], function(ModalView, SliderHelper){

  var StarSelectModal= ModalView.extend({
    className: 'star-select-modal',
    template: _.template($('#tmpl-star-select-modal').html()),

    events: _.extend({}, ModalView.prototype.events, {
    }),

    render: function(){
      ModalView.prototype.render.call(this);
      this.$el.html(this.template(this.model));
      $('body').append(this.el);
      return this;
    }

  });

  return StarSelectModal;
});