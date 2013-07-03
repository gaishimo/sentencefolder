var _ = require('underscore'),
     tags = require('../models/dao/tags_dao');

module.exports = {

  list: function(req, res){
    var userId = req.session.user._id;
    tags.find({
        query: { user_id: userId }, fields: { tag_id: 1 },
        sort: { tag_id: 1 }
      },
      function(err, results){
        if(err){ res.send(500); return; }
        res.json(results);
      }
    );
  }

};