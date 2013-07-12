define([], function(){

  //singleton
  var DelConfirm = function(){
    var instance = this;

    var s = {
      delConfirm: '#del-confirm',
      delBtn: '.del-confirm-del',
      cancelBtn: '.del-confirm-cancel',
      overAllLayer : '#overall-layer',
    };

    var resetEvents = function(){
      $(s.delConfirm)
        .find(s.delBtn).off('click').end()
        .find(s.cancelBtn).off('click');
      $(s.overAllLayer).off('click');
    };

    this.show= function(option){
      var $overLayer = $(s.overAllLayer).fadeIn(300);
      var $delConfirm = $(s.delConfirm);
      var onCancel = function(){
        $(s.overAllLayer).fadeOut(300);
          option.onCancel();
          $(s.delConfirm).fadeOut(300);
          resetEvents();
      };

      option = _.extend( { onYes: function(){}, onCancel: function(){} }, option);
      $delConfirm
        .fadeIn(300)
        .find(s.delBtn).on('click', function(){
          $overLayer.fadeOut(300);
          $delConfirm.fadeOut(300);
          option.onYes();
          resetEvents();
        }).end()
        .find(s.cancelBtn).on('click', onCancel);
      $(s.overAllLayer).on('click', onCancel);
    }


    DelConfirm = function(){
      return instance;
    }
  };
  return new DelConfirm();
});