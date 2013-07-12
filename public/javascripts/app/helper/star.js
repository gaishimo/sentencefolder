define([], function(){

  //singleton
  var StarHelper = function(){
    var instance = this;

    this.switchStar = function($star){
      var starIdx = parseInt($star.attr('data-star-idx'));
      if(starIdx !== 5){
        $star.removeClass('icon-star-empty').addClass('icon-star');
        starIdx++;
      }else{
        $star.removeClass('icon-star').addClass('icon-star-empty');
        starIdx = 0;
      }
      $star.attr('data-star-idx', starIdx);
      return starIdx;
    };

    this.setStar = function($star, val){
      if(val === 0){
        $star.removeClass('icon-star').addClass('icon-star-empty');
      }else{
        $star.removeClass('icon-star-empty').addClass('icon-star');
      }
      $star.attr('data-star-idx', val);
    };

    StarHelper = function(){
      return instance;
    }
  };
  return new StarHelper();
});