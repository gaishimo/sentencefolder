var _ = require('underscore'),
  moment = require('moment'),
  async = require('async'),
  ObjectId = require('mongoskin').ObjectID,
  model = require('../dao/sentences_dao'),
  sequence = require('../dao/sentences_seq_dao'),
  tags = require('../dao/tags_dao');

module.exports = {

  list: function( user_id, param, callback){
    var query = this.prepareQuery(param, user_id);
    var sort = { created_at: -1 };
    var condition;

    if(!_.isUndefined(param.sort)){
      switch(param.sort){
        case  '1': sort.created_at = 1; break;
        case '-2': sort.last_studied_time = -1; break;
        case '2': sort.last_studied_time = 1; break;
      }
    }

    condition = { query: query, sort: sort, limit: 20 };
    if(!_.isUndefined(param.offset)){
      condition.skip = param.offset;
    }
    model.find(condition, callback);
  },

  count: function( user_id, param, callback ){
    var query = this.prepareQuery(param, user_id);
    model.count(query, callback);
  },

  create: function( userId, sentenceData, callback ){
    sequence.getNextSequence(userId, function(err, result){
      var newSentence = _.extend(sentenceData,
          { user_id: userId, created_at: new Date(), sentence_id: result} );
      model.insert(newSentence, function(err, result){
        if(err){ callback(err); return; }
        if(result[0].tags.length > 0){
          tags.addTags(userId, result[0].tags, function(){
            callback(err, result);
          });
        }else{
          callback(err, result);
        }
      });
    });
  },

  update: function(userId, itemId, sentence, callback){
    var updateDoc = {};
    _.each( ['question', 'description', 'answers', 'dialog',
        'param_sets', 'studied_times', 'point', 'star', 'tags', 'situation'], function(field){
      if( !_.isUndefined(sentence[field]) ){
        if(field === 'studied_times'){
          var dates = _.map(sentence[field], function(d){
            return moment(d).toDate();
          });
          updateDoc['studied_times'] = dates;
          updateDoc['last_studied_time'] = _.max(dates);
          console.log("id:" + itemId + " studied_time: ", dates);
        }else{
          updateDoc[field] = sentence[field];
        }
      }
    });

    model.update( { _id: ObjectId(itemId) }, {$set: updateDoc}, function(err, result){
      if(err){ callback(err); return; }

      if( updateDoc.tags && updateDoc.tags.length > 0 ){
        tags.addTags(userId, updateDoc.tags, function(){
          callback(err, result);
        });
      }else{
        callback(err, result);
      }
    });
  },

  prepareQuery: function(p, user_id){
    var query = { user_id: user_id };
    if(!_.isUndefined(p.point_min)){
      query.point = { $gte: p.point_min, $lte: p.point_max };
    }

    if(!_.isUndefined(p.tags)){
      query.tags = { $all: p.tags.split(',') };
    }

    if(!_.isUndefined(p.star)){
      query.star = p.star;
    }

   if(!_.isUndefined(p.last_studied_time_min)){
     var criteria = [];
     var rangeEnd = moment()
        .add('days', -p.last_studied_time_max )
        .toDate();
     if(p.last_studied_time_min === 0 ){

        if(p.last_studied_time_max !== 0){
          query.$nor = [];
          query.$nor.push({ last_studied_time: {$exists: true, $lt: rangeEnd}  });
        }else{
          query.last_studied_time = { $exists: false };
        }
     }else{
       var rangeBegin = moment()
          .add('days', -p.last_studied_time_min )
          .toDate();
       query.last_studied_time = { $lte: rangeBegin, $gte: rangeEnd };
     }

   }
    if(!_.isUndefined(p.text)){
      if(p.text_lang === 'ja'){
        query.$or =  query.$or || [];
        var regexp = new RegExp( p.text , 'ig');
        query.$or.push({ question: regexp });
        query.$or.push({ situation: regexp });
        query.$or.push({ memo: regexp });
        query.$or.push({ tags: regexp });
        query.$or.push({ 'dialog.before.question': regexp });
        query.$or.push({ 'dialog.after.question': regexp});
        query.$or.push({ 'answer.memo': regexp});
        query.$or.push({ 'param_sets.params.question': regexp });
      }else if(p.text_lang === 'en'){
        query.$or = [];
        var regexp = new RegExp( p.text , 'ig');
        query.$or.push({ 'answers.sentence': regexp });
        query.$or.push({ 'dialog.before.answer': regexp });
        query.$or.push({ 'dialog.after.answer': regexp});
        query.$or.push({ tags: regexp });
        query.$or.push({ 'param_sets.params.answer': regexp});
      }else{
        query.sentence_id = parseInt(p.text, 10);
      }

      console.log("query", query);
    }

    return query;
  }



};