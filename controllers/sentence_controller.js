var _ = require('underscore'),
      ObjectId = require('mongoskin').ObjectID,
      moment = require('moment'),
      model = require('../models/dao/sentences_dao'),
      sequence = require('../models/dao/sentences_seq_dao'),
      sentencesLogic = require('../models/logic/sentences_logic')
      request_util = require('../util/request_util');

module.exports = {

  list: function(req, res){
    var user_id = req.session.user._id;
    var param = request_util.editParams(req.query, {
      intParams: ['offset', 'point_min', 'point_max', 'star',
                        'last_studied_date_min', 'last_studied_date_max']
    });
    sentencesLogic.list(user_id, param, function(err, list){
      res.json(list);
    });
  },

  count: function(req, res){
    var user_id = req.session.user._id;
    var param = request_util.editParams(req.query, {
      intParams: ['point_min', 'point_max', 'star',
                        'last_studied_date_min', 'last_studied_date_max']
    });
    sentencesLogic.count(user_id, param, function(err, cnt){
      res.json({cnt: cnt});
    });
  },

  create: function(req, res){
    var user_id = req.session.user._id,
          newSequence;
    sequence.getNextSequence(user_id, function(err, result){
      newSentence = _.extend(req.body,
          { user_id: user_id, created_at: new Date(), sentence_id: result} );
      model.insert(newSentence, function(err, result){
          if(err){
              res.send(500);
              return;
          }
          res.send(result[0]);
      });
    });
  },

  update: function(req, res){
    var user_id = req.session.user._id,
          id = req.param('id'),
          sentence = req.body,
          updateDoc = {};

    _.each( ['question', 'description', 'answers', 'dialog',
        'param_sets', 'studied_times', 'point', 'star', 'tags', 'situation'], function(field){
      if( !_.isUndefined(sentence[field]) ){
        if(field === 'studied_times'){
          var dates = _.map(sentence[field], function(d){
            return moment(d).toDate();
          });
          console.log("dates", dates);
          updateDoc['studied_times'] = dates;
          updateDoc['last_studied_time'] = _.max(dates);
        }else{
          updateDoc[field] = sentence[field];
        }
      }

    });
    updateDoc.updated_at = new Date();

    model.update( { _id: ObjectId(id) }, {$set: updateDoc}, function(err, doc){
      if(err){
        res.send(500);
        return;
      }
      res.json(doc);
    });
  },

  delete: function(req, res){
    var id = req.param('id');
    model.remove({ _id: ObjectId(id) }, function(err, result){

      if(err){
        res.send(500);
        return;
      }
      if(result !== 1){
        res.send(404);
        return;
      }
      res.send(200);
    });

  }



};