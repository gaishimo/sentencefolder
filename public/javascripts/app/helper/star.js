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

    StarHelper = function(){
      return instance;
    }
  };
  return new StarHelper();
});