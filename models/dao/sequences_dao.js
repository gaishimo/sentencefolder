var _ = require('underscore'),
    mongodao = require('./mongo_dao');

module.exports = function(collectionName, url){
  return _.extend(mongodao(collectionName, url), {
    getNextSequence: function( id, callback){
      this.findAndModify(  {
        query: { _id: id },
        update: {  $inc: { seq: 1 }, $set:{ updated_at: new Date() } }
      }, function(err, result){
        callback(err, result.seq);
      } );
    }
  });
};