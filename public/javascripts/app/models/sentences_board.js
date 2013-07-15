define(['../collections/sentences','backbone'],
    function(SentenceCollection){
  var SentencesBoardModel = Backbone.Model.extend({
    defaults: {
    },
    url: function(){
      return '/' + this.id + '/sentences/';
    },
    initialize: function() {
      this.sentences = new SentenceCollection();
    },
    parse: function(res){
      console.log("SentencesBoardModel parse()");
      return res;
    }
  });
  return SentencesBoardModel;
});
