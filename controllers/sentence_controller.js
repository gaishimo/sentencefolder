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
                        'last_studied_time_min', 'last_studied_time_max']
    });
    sentencesLogic.list(user_id, param, function(err, list){
      res.json(list);
    });
  },

  count: function(req, res){
    var user_id = req.session.user._id;
    var param = request_util.editParams(req.query, {
      intParams: ['point_min', 'point_max', 'star',
                        'last_studied_time_min', 'last_studied_time_max']
    });
    sentencesLogic.count(user_id, param, function(err, cnt){
      res.json({cnt: cnt});
    });
  },

  create: function(req, res){
    var userId = req.session.user._id,
          newSequence;
    sentencesLogic.create(userId, req.body, function(err, result){
      if(err){
          res.send(500);
          return;
      }
      res.send(result[0]);
    });
  },

  update: function(req, res){
    var userId = req.session.user._id,
          id = req.param('id'),
          sentence = req.body;
    sentencesLogic.update(userId, id, sentence, function(err, result){
      if(err){
        res.send(500);
        return;
      }
      res.json(result);
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