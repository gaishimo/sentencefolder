define([ './modal', '../helper/slider', 'backbone'],
    function(ModalView, SliderHelper){
  var ProgressModalView = ModalView.extend({
    className: 'progress-modal',
    template: _.template($('#tmpl-progress-modal').html()),

    events: _.extend({}, ModalView.prototype.events, {
    }),

    render: function(){
      ModalView.prototype.render.call(this);
      this.$el.html(this.template(this.model));
      this.options.studyItemEl.find('.study-item-container').append(this.el);
      return this;
    },

    setSlider: function(){
      var self = this;
      var $slider = this.$('.progress-modal-slider');
      var $point =  this.options.studyItemEl.find('.point');
      SliderHelper.setSlider($slider, $point,
        this.model.get('point'), function(pointVal){
          $slider.closest('.study-item-container')
                  .removeClass(SliderHelper.getPointClasses().join(' '))
                  .addClass('point-'+ pointVal);
          self.pointUpdating = pointVal;

          //update for the latest slider operation in 2 seconds
          setTimeout(function(){
            if(self.pointUpdating !== null){
              self.model.save({ 'point': self.pointUpdating }, {
                patch: true
              });
              self.pointUpdating = null;
            }
          }, 2000);
        }
      );

    }



  });
  return ProgressModalView;
});