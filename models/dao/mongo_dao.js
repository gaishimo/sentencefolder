var config = require('config'),
  mongo = require('mongoskin'),
  _ = require('underscore'),
  array_util = require('../../util/array_util');


module.exports = function(collection, url){
  url = url || config.db.mongodb.url;
  var db = null,
        manualClose= false,
        connect = function connect(){
          db = db || mongo.db(config.db.mongodb.url, { w: 1 });
          return db.collection(collection);
        };

  return {

    closeAutomatically: function(){
      if(!manualClose){
        db.close();
      }
    },

    setManualCloseOn: function(){
      manualClose = true;
    },
    setAutoCloseOn: function(){
      manualClose = false;
    },

    closeManually: function(){
      if(manualClose){
        db.close();
        manualClose = false;  //restore to original state
      }
    },
    find: function( condition, callback ){
      var self = this;
      var defaults = {
        query : {},
        fields: {},
        sort: { _id: 1 },
        limit: null,
        skip: null
      };
      var c = _.extend( defaults, condition );
      var collection = connect();
      var finded = collection.find(c.query, c.fields).sort(c.sort);
      if(c.limit){
        finded  = finded.limit(c.limit);
      }
      if(c.skip){
        finded  = finded.skip(c.skip);
      }

      finded.toArray(function(err, results){
        self.closeAutomatically();
        if(c.sort && results && results.length > 0){
          var sortKey, sortVal;
          _.map(c.sort, function(v, k){
            sortKey = k;
            sortVal = v;
          });
          //sort manually because can't sort while ignoring case
          array_util.sortIgnoreCase(
            results, sortKey, sortVal === -1 );
        }
        callback(err, results);
      });
    },

    findOne: function( query, fields_arg, callback ){
      var self = this;
      var fields = {};
      if(_.isFunction(fields_arg)){
        callback = fields_arg;
      }else{
        fields = fields_arg;
      }
      var collection = connect();
      collection.findOne(query, fields, function(err, result){
        self.closeAutomatically();
        callback(err, result);
      });
    },

    count: function( query, callback ){
      var self = this;
      var collection = connect();
      collection.count(query, function(err, cnt){
        self.closeAutomatically();
        callback(err, cnt);
      });
    },

    exist: function(query, callback){
      var self = this;
      this.count(query, function( err, cnt ){
        self.closeAutomatically();
        if(err){
          callback(err);
        }else{
          callback(err, cnt > 0);
        }
      });
    },

    findAndModify : function( condition, callback){
      var self  =this;
      var collection = connect();
      if(!condition.sort){
        condition.sort = {};
      }
      console.log("findAndModify", condition);

      collection.findAndModify(condition.query,
            condition.sort, condition.update,
            { new : true, upsert: true }, function(err, result){
          self.closeAutomatically();
          console.log("err", err);
          console.log("result", result);
          callback(err, result);
        }
      );
    },

    insert: function( doc, callback ){
      var self = this;
      var collection = connect();
      collection.insert( doc, function( err, result ){
        self.closeAutomatically();
        callback(err, result);
      });
    },

    /**
      * arg3 : callback or multiUpdate
      * arg4 : callback function if arg3 is multiUpdate
      */
    update: function( criteria, doc, arg3, arg4 ){
      var self = this;
      var isMulti = true;
      var callback = arg4;
      if(_.isFunction(arg3)){
        callback = arg3;
      }else{
        isMulti = arg3;
      }
      var collection = connect();
      collection.update( criteria, doc,
        { safe: true, multi: isMulti }, function( err, result ){
        self.closeAutomatically();
        callback(err, result);
      });
    },

    upsert: function( selector, doc, callback ){
      var self  =this;
      var collection = connect();
      collection.update( selector, doc,
          { safe: true, upsert: true }, function(err, result){
        self.closeAutomatically();
        callback(err, result);
      });
    },

    save: function(doc, callback){
      var self  =this;
      collection.save(doc, function(){
        self.closeAutomatically();
        callback(err, result);
      });
    },

    remove: function(selector, options_arg, callback){
      var self = this;
      var options = {};
      if(_.isFunction(options_arg)){
        callback = options_arg;
      }else{
        options = options_arg;
      }
      var collection = connect();
      collection.remove(selector, options, function(err, result){
        self.closeAutomatically();
        callback(err, result);
      });
    },



  };
};