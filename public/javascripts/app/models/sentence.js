define([ 'underscore', 'moment', 'underscore-string', 'backbone', 'backbone.compute'],
    function(){
  'use strict';
  var SentenceModel = Backbone.Model.extend({

    idAttribute: '_id',

    initialize: function(){
      Backbone.Compute(this);
    },

    defaults:{
      sentence_id: '',
      answers: [ { 'sentence': '', 'memo': '' } ],
      dialog: {
        before: [ { 'question': '', 'answer': '', speaker: 1 } ],
        after: [ { 'question': '', 'answer': '', speaker: 1 } ],
      },
      star: 0,
      point: 0,
      studied_times: [],
    },

    url: function(){
      if(this.isNew()){
        return '/sentences/new';
      }else{
        return _.str.sprintf('/sentences/%s', this.id);
      }
    },

    validate: function(attrs, options){
      if(_.isEmpty(attrs.question)){
        return '日本語文が入力されていません';
      }
    },

    formattedTags: {
      fields: ['tags'],
      compute: function(fields){
        var tags = fields.tags || [];
        return tags.join(', ');
      }
    },

    formattedStudiedTimes: {
      fields: ['studied_times'],
      compute: function(fields){
        var formattedArray = [];

        fields.studied_times = _.sortBy(fields.studied_times, function(d){
          return -( moment(d).unix() ) ;
        });
        return _.map(fields.studied_times, function(d){
          return moment(d).format('YYYY/MM/DD HH:mm')
        });
      }
    },

    formattedCreatedTime: {
      fields: ['created_at'],
      compute: function(fields){
        if(fields.created_at){
          return moment(fields.created_at).format('YYYY/MM/DD HH:mm');
        }else{
          return '';
        }

      }
    },

    formattedUpdatedTime: {
      fields: ['updated_at'],
      compute: function(fields){
        if(fields.updated_at){
          return moment(fields.updated_at).format('YYYY/MM/DD HH:mm');
        }else{
          return '';
        }

      }
    },

    formattedLastStudiedTime: {
      fields: ['last_studied_time'],
      compute: function(fields){
        if(fields.last_studied_time){
          return moment(fields.last_studied_time).format('YYYY/MM/DD');
        }else{
          return '';
        }

      }
    },

    toJSON: function(){
      var attrs = _.clone(this.attributes);
      delete attrs.formattedStudiedTimes;
      delete attrs.formattedLastStudiedTime;
      delete attrs.isNew;
      return attrs;
    }

  });
  return SentenceModel;
});
