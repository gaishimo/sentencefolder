define([], function(){

  //singleton
  var SliderHelper = function(){
    var instance = this;

    var classes = (function(){
      var classes = [];
      for(var i =0; i <= 10; i++){
          classes.push('point-' + i*10);
      }
      return classes;
    })();

    this.getPointClasses = function(){
      return classes;
    };

    this.setSlider = function($slider, $pointText, point, callback){
      $slider.simpleSlider({
        "range": [0, 100],
        "step": 10
      }).simpleSlider('setValue', point)
        .on('slider:changed', function(ev, data){
          var pointVal = data.value;
          $pointText.text(pointVal);
           callback(pointVal);
        });
      return instance;
    };

    this.unsetSlider = function($slider){
      $slider.off('slider:changed');
    };

  };
  return new SliderHelper();
});