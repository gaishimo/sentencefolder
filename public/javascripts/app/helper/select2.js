define(['../models/app_model'], function(AppModel){

  //singleton
  var Select2Helper = function(){
    var instance = this;

    var getTagsDataForSelect2 = function(){
      var tags = AppModel.getTagList();
      return tags.map(function(t){
        var tagid = t.get('tag_id');
        return { id: tagid, text: tagid };
      });
    };

    this.createOneForTags = function($elem, maxSelectSize, isEnableAdd){
      var $elem = $elem.select2({
          tags: [],
          maximumSelectionSize: maxSelectSize,
          query: function (query) {
            var tags = getTagsDataForSelect2();
            var filteredTags = _.filter(tags, function(tag){
              return query.term.length === 0 ||
                  tag.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0;
            });
            if(isEnableAdd && query.term.length > 0){
              filteredTags.push({ id: query.term, text: query.term });
            }

            query.callback({ results: filteredTags });
          },
          initSelection: function(element, callback){
            var vals = _.map(element.val().split(','), function(val){
              return { id: val, text: val};
            });
            callback(vals);
          }
      });

      $elem.find('.select2-choices').click(function() {
        $elem.find('.select2-search-field input', this).focus();
      });

      // $('body').on('click', '.select2-choices', function(e) {
      // $('.select2-search-field input', this).focus();
      // });

      return $elem;

    };

    Select2Helper = function(){
      return instance;
    }
  };
  return new Select2Helper();
});