define(['backbone'],
    function(){
  'use strict';
  var ModalView = Backbone.View.extend({
    events:{
      'click .icon-remove-sign': 'close'
    },
    render: function(){
      var self = this;
      $('#overall-layer')
          .show()
          .on('click', function(){ self.close(); });
      return this;
    },
    close: function() {
      console.log("close");
      this.remove();
      $('#overall-layer').hide().off('click');
    }
  });
  return ModalView;
});