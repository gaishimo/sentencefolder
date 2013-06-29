var _ = require('underscore');
module.exports = {
  sortIgnoreCase : function(array, key, desc){
    array.sort(function(a, b){
      var valA, valB;
      if(!desc){
        valA = a[key];
        valB = b[key];
      }else{
        valB = a[key];
        valA = b[key];
      }
      if( _.isUndefined(valA) || _.isUndefined(valB)){
        return 0;
      }
      if( _.isString(valA) || _.isString(valB)){
        if (valA.toLowerCase() < valB.toLowerCase()){
          return -1;
        }
        if (valA.toLowerCase() > valB.toLowerCase()){
          return 1;
        }
        return 0;
      }else{
        return valA - valB;
      }
    });
  }
};