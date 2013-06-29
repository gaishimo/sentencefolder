define([], function(){

  //singleton
  var StudiedRangeUtil = function(){
    var instance = this;

    var setting = {
      'val-0' : { text: '未学習', day: 0 },
      'val-1' : { text: '1日前', day: 1 },
      'val-2' : { text: '2日前', day: 2 },
      'val-3' : { text: '3日前', day: 3 },
      'val-4' : { text: '5日前', day: 5 },
      'val-5' : { text: '1週間前', day: 7 },
      'val-6' : { text: '2週間前', day: 14 },
      'val-7' : { text: '3週間前', day: 21 },
      'val-8' : { text: '1ヶ月前', day: 30 },
      'val-9' : { text: '2ヶ月前', day: 60 },
      'val-10' : { text: '半年前', day: 180 },
      'val-11' : { text: '1年前', day: 365 },
      'val-12' : { text: '1年以上前', day: 99999 },
    };

    this.getSetting = function(){
      return setting;
    };

    StudiedRangeUtil = function(){
      return instance;
    }
  };
  return new StudiedRangeUtil();
});