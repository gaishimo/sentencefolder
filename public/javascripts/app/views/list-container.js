define(['../models/app_model', './list-header', './study-item-list', './study-item',
   '../collections/sentences',  '../models/sentence', 'backbone'],
    function(AppModel, ListHeaderView, StudyItemListView, StudyItemView,
        SentenceCollection, SentenceModel){
  'use strict';
  var ListContainerView = Backbone.View.extend({

    initialize: function(){
      this.listenTo( AppModel.getGeneralModel(), {
        'show_list_container':  this.setBottomEvent,
        'hide_list_container': this.unsetBottomEvent
      });
    },

    render: function(){
      var self = this;

      var sentences = AppModel.getSentenceList();
      //set default sort
      sentences.comparator= function(s){
        return -( moment(s.get("created_at")).unix() );
      };

      this.listHeaderView = new ListHeaderView( {
        el: '#list-header' ,
        collection: sentences
      } );
      this.$el.append(this.listHeaderView.render().el);

      this.studyItemListView = new StudyItemListView({
          modelView: StudyItemView,
          el: this.$('#study-item-list'),
          collection: sentences
      });

      sentences.fetch({ success: function(){
         self.$el.append(self.studyItemListView.render().el);
         self.collection = sentences;
         self.setBottomEvent();
      }});
      AppModel.getGeneralModel().trigger('load_items', {});

      return this;
    },

    setBottomEvent: function(){
      var self = this;
      $(window).bottom().on('bottom', function(){
        var $window = $(this);
        var currentSize = self.collection.length;
        var newRecords = new SentenceCollection();
        var filterParams;

        if(!$window.data('loading')) {
          $window.data('loading', true);
          $('#study-item-list-loading').show();
          filterParams = AppModel.getFilterModel().attributes;
          newRecords.fetch({
            data: _.extend( {}, filterParams, { offset: currentSize }),
            success: function(fetchedCollection){
              $window.data('loading', false);
              $('#study-item-list-loading').hide(function(){
                self.collection.add(fetchedCollection.models);
              });
            }
          } );
        }
      });
    },

    unsetBottomEvent: function(){
      $(window).bottom().off('bottom');
    }




  });
  return ListContainerView;
});