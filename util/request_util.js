var _ = require('underscore');
var object_util = require('./object_util');

module.exports = {

  getParams: function(req, editInfo){
    var newObj = {};
    for (var key in req.params) {
      if( req.params.hasOwnProperty(key) ){
        newObj[key] = req.params[key];
      }
    }
    return this.editParams(newObj, editInfo);
  },

  editParams: function(arg_params, editInfo){
    var info = editInfo;
    var params = _.clone(arg_params);
    if(info.intParams){
      params = object_util.parsePropertiesToInt(params, info.intParams);
    }
    if(info.booleanParams){
      params = object_util.parsePropertiesToBoolean(
        params, info.booleanParams);
    }
    if(info.dateParams){
      params = object_util.parsePropertiesToDate(
        params, info.dateParams);
    }
    if(info.defaultParams){
        params = _.extend(info.defaultParams, params);
    }
    return params;
  }
};