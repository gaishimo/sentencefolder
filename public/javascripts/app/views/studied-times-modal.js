define([ './modal',  'backbone'],
    function(ModalView){
  var studiedTimesModalView = ModalView.extend({
    className: 'studied-times-modal',
    template: _.template($('#tmpl-studied-times-modal').html()),

    initialize: function(options){
    },

    events: _.extend({}, ModalView.prototype.events, {
      'click .remove-studied-time': 'removeStudiedTime'
    }),

    render: function(){

      ModalView.prototype.render.call(this);

      if(this.options.isMobile){
        this.$el.addClass('studied-times-modal-mb');
      }

      this.$el.html(this.template(this.model));
      return this;
    },

    removeStudiedTime: function(ev){
      var self = this;
      var $li = $(ev.target).closest('li');
      var $ul = $(ev.target).closest('ul');
      var idx = $ul.children('li').index($li);
      var studiedTimes = this.model.get('studied_times');
      var lastStudiedTime;
      studiedTimes = _.sortBy(studiedTimes, function(d){
        return -( moment(d).unix() );
      });
      studiedTimes.splice(idx, 1);
      lastStudiedTime = studiedTimes.length > 0 ? studiedTimes[0] : null;

      this.model.save( {
          studied_times:  studiedTimes,
          last_studied_time: lastStudiedTime
        },
        {
          patch: true,
          success: function(model){
            self.model.formattedStudiedTimes();
            self.model.formattedLastStudiedTime();
            $li.fadeOut(500, function(){
              $li.remove();
              model.trigger('update_studied_times');
            });
          }
        }
      );
    }

  });
  return studiedTimesModalView;
});