define([ '../models/sentence', 'backbone'],
    function(SentenceModel){
  'use strict';
  var SentenceCollection = Backbone.Collection.extend({
    model: SentenceModel,
    initialize: function(){
    },
    url: 'sentences',

    count: function(param, option){
      $.ajax({
          type : "get",
          url : "/sentences/cnt",
          async: true,
          data: param,
          contentType : "application/json; charset=utf-8",
          success : function(data){
            option.onSuccess(data.cnt);
          },
          error : function(xhr){
              console.log("http request failure.");
          }
      });
    }

  });
  return SentenceCollection;
});
