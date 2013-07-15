//need underscore.js
(function(){
var tags = [];
var userid = 'guest1';
var maxid = 0;
db.sentences.find({ user_id: 'user1' }).sort({ sentence_id: 1 }).forEach(function(d){
  d.user_id = userid;
  d.created_at = new Date();
  d.updated_at = new Date();
  delete d._id;
  delete d.formattedCreatedTime;
  db.sentences.insert(d);
  if(d.tags){
    tags = _.uniq(tags.concat(d.tags));
  }
  maxid = d.sentence_id;
});

// tags.forEach(function(t){
//   db.tags.insert({ user_id: userid, tag_id: t, created_at: new Date() });
// });

})();