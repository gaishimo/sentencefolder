define(['../models/app_model', './list-header', './study-item-list', './study-item',
   '../collections/sentences',  '../models/sentence', 'backbone'],
    function(AppModel, ListHeaderView, StudyItemListView, StudyItemView,
        SentenceCollection, SentenceModel){
  'use strict';
  var ListContainerView = Backbone.View.extend({

    initialize: function(){
      this.listenTo( AppModel.getGeneralModel(), {
        'show_list_container':  this.setBottomEventHandler,
        'hide_list_container': this.unsetBottomEventHandler
      });
    },

    render: function(){
      var self = this;
      $('.loading').hide();
      var sentences = AppModel.getSentenceList();
      //set default sort
      sentences.comparator= function(s){
        return -( moment(s.get("created_at")).unix() );
      };

      this.studyItemListView = new StudyItemListView({
          modelView: StudyItemView,
          el: this.$('#study-item-list'),
          collection: sentences
      });
      this.listHeaderView = new ListHeaderView( {
        el: '#list-header' ,
        collection: sentences
      } );
      this.$el.append(this.listHeaderView.render().el);
      this.$el.append(this.studyItemListView.render().el);

      // sentences.fetch({ success: function(){
      //    self.$el.append(self.studyItemListView.render().el);
      //    self.collection = sentences;
      //    self.setBottomEventHandler();
      // }});
      // AppModel.getGeneralModel().trigger('load_items', {});

      return this;
    },

    setBottomEventHandler: function(){
      var self = this;
      $(window).on('bottom', function(){
        var $window = $(this);
        var currentSize = self.collection.length;
        var newRecords = new SentenceCollection();
        var filterParams;

        if(!self.loading){
          self.loading = true;
          $('#study-item-list-loading').addClass('icon-spin').show();
          filterParams = AppModel.getFilterModel().attributes;
          newRecords.fetch({
            data: _.extend( {}, filterParams, { offset: currentSize }),
            success: function(fetchedCollection){
              self.loading = false;
              $('#study-item-list-loading').removeClass('icon-spin').hide(function(){
                self.collection.add(fetchedCollection.models);
              });
            }
          } );
        }
      });
    },

    unsetBottomEventHandler: function(){
      $(window).off('bottom');
    }




  });
  return ListContainerView;
});