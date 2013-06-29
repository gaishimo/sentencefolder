define([], function(){

  //singleton
  var InputUtils = function(){
    var instance = this;
    var keypressCount= 0;
    this.checkTextIsChanged= function(ev){
      var isChanged = false;
      console.log("ev.keyCode ", ev.keyCode);
      if (ev.type === 'keypress' && (ev.keyCode !== 241) && (ev.keyCode !== 242)) {
        keypressCount++;
      } else if (ev.type === 'keyup') {
        keypressCount--;

        if ( keypressCount < 0 ) {
          // Enter key on IME mode
          if (ev.keyCode === 13) {
            isChanged = true;
          }
          keypressCount = 0;
        } else {
          //input direct
          isChanged = true;
        }
      }

      return isChanged;
    }

    InputUtils = function(){
      return instance;
    }
  };
  return new InputUtils();
});