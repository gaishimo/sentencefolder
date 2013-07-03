//need underscore.js
(function(){
  var tagids = [], tags;
  db.sentences.find({ user_id: 'user1' }, { tags: 1 }).forEach(function(doc){
    tagids = _.uniq(tagids.concat(doc.tags));
  });
  tags = _.map(tagids, function(tagid){
    return { user_id: 'user1', tag_id: tagid, created_at: new Date() };
  });
  db.tags.insert(tags);
})();

