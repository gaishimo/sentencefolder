var _ = require('underscore'),
      moment = require('moment');

module.exports = {
  parsePropertiesToInt : function(obj, properties){
    _(obj).map(function(val, key){
      if( val && _.contains(properties, key) ){
        var parsedVal = parseInt(val, 10);
        if( _.isNaN(parsedVal) ){
            delete obj[key];
        }else{
            obj[key] = parsedVal;
        }

      }
    });
    return obj;
  },
  parsePropertiesToBoolean : function(obj, properties){
    _(obj).map(function(val, key){
      if( val && _.contains(properties, key) ){
        obj[key] = ( val === 'true');
      }
    });
    return obj;
  },
  parsePropertiesToDate : function(obj, properties, dateformat){
    _(obj).map(function(val, key){
      if( val && _.contains(properties, key) ){
        if(moment(val, dateformat).isValid()){
          if(dateformat){
            obj[key] = moment(val, dateformat).toDate();
          }else{
            obj[key] = moment(val).toDate();
          }

        }else{
          delete obj[key];
        }
      }
    });
    return obj;
  }

};