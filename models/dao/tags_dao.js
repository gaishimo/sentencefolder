var _ = require('underscore'),
     async = require('async');

var mongodao = require('./mongo_dao');
module.exports = _.extend( mongodao('tags'), {
  addTags: function( user_id, tag_ids, callback ){
    var self = this;
    this.setManualCloseOn();
    async.eachSeries(tag_ids,
      function iterator(tag_id, cb) {
        self.addTag( user_id, tag_id, function(){
          cb(null);
        });
      },
      function after(err) {
        self.closeManually();
        callback(err);
      }
   );
  },

  /**
    * return true when new tag is added
    */
  addTag: function( user_id, tag_id, callback ){
    var me = this;

    this.exist(
      { user_id: user_id, l  tag_id: tag_id },
      function(err, isExist){
        if(isExist){
          callback(err, false);
        }else{
            me.insert(
              {
                user_id: user_id,
                tag_id: tag_id, created_at: new Date()
              },
              function(err){
                callback(err, true);
              }
            );
        }
      }
    );
  }
});