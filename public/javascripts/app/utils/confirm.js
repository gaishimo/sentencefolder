define([], function(){

  //singleton
  var DeleteConfirm = function(){
    var instance = this;
    var resetEvents = function(){
      $('#del-confirm')
        .find('.del').off('click').end()
        .find('.cancel').off('click');
      $('#overall-layer').off('click');
    }


    this.show= function(option){
      var $overLayer = $('#overall-layer').fadeIn(300);
      var $delConfirm = $('#del-confirm');
      var onCancel = function(){
        $('#overall-layer').fadeOut(300);
          option.onCancel();
          $('#del-confirm').fadeOut(300);
          resetEvents();
      };

      option = _.extend( { onYes: function(){}, onCancel: function(){} }, option);
      $delConfirm
        .fadeIn(300)
        .find('.del').on('click', function(){
          $overLayer.fadeOut(300);
          $delConfirm.fadeOut(300);
          option.onYes();
          resetEvents();
        }).end()
        .find('.cancel').on('click', onCancel);
      $('#overall-layer').on('click', onCancel);
    }


    DeleteConfirm = function(){
      return instance;
    }
  };
  return new DeleteConfirm();
});