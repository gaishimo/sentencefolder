define([
  '../models/app_model',
  './studied-times-modal',
  './study-item-edit',
  '../utils/confirm',
  '../helper/star',
  '../helper/slider',
  '../helper/transition',
  'backbone',
  'slider',
  'tiptip'
  ],
  function(AppModel, StudiedTimesModalView, StudyItemEditView,
     ConfirmUtils, StarHelper, SliderHelper, TransitionHelper){

  'use strict';
  var StudyItemView = Backbone.View.extend({
    template: _.template($('#tmpl-study-item').html()),
    templateStudiedTimes: _.template($('#tmpl-studied-times').html()),
    pointUpdating: null,
    starUpdating: null,

    initialize: function(){
      this.listenTo(this.model, {
        update_studied_times: this.renderStudiedTimes,
        update_tags: this.renderTags
      });
      this.listenTo(AppModel.getGeneralModel(), {
        'select_all_item': this.selectAllItem,
        'unselect_all_item': this.unselectAllItem,
      });
    },

    events: function(){
      return{
        'click .item-select': 'clickItemSelect',
        'click .icon-star,.icon-star-empty': 'clickStar',
        'click .icon-trash': 'clickTrash',
        'click .studied-times': 'clickStudiedTimes',
        'click .title': _.debounce(this.gotoEdit, 1000, true)
      }
    },

    remove: function(){
      Backbone.View.prototype.remove.call(this);
      this.unsetSlider();
    },

    render: function(model){
      var self = this;
      this.$el.html(this.template(this.model));
      this.renderStudiedTimes();
      this.$el.find('.tooltip').tipTip( { defaultPosition: 'top' } );
      return this;
    },

    renderStudiedTimes: function(){
      var $originalEl = this.$el.find('.studied-times');
      var $newEl = this.templateStudiedTimes(this.model);
      if($originalEl.length > 0){
        $originalEl.remove();
      }
      this.$el.find('.progress').append($newEl);
    },

    renderTags: function(){
      var $text = this.$('.tags-text>a');
      var tags = this.model.get('formattedTags');
      $text.fadeOut(500, function(){
        $text.attr('title', 'タグ: ' + tags)
                .text(tags)
                .tipTip( { defaultPosition: 'top' } );
        $text.fadeIn(2000);
      });

    },

    setSlider: function(){
      var self = this;

      var $slider = this.$('.slider');
      var $point = $slider.siblings('div').children('.point');
      SliderHelper.setSlider($slider, $point,
        this.model.get('point'), function(pointVal){
          $slider.closest('.study-item')
                  .removeClass(SliderHelper.getPointClasses().join(' '))
                  .addClass('point-'+ pointVal);
          self.pointUpdating = pointVal;

          //update for the latest slider operation in 2 seconds
          setTimeout(function(){
            if(self.pointUpdating !== null){
              self.model.save({ 'point': self.pointUpdating }, {
                patch: true
              });
              self.pointUpdating = null;
            }
          }, 2000);
        }
      );

    },

    unsetSlider: function(){
      SliderHelper.unsetSlider(this.$('.slider'));
    },

    clickItemSelect: function(ev){
      var current = this.$('.item-select').attr('data-checked') === 'true';
      var changeTo = !current;
      this.$('.item-select').attr('data-checked', changeTo)

      if(changeTo){
        AppModel.getGeneralModel().trigger('selected_item');
      }else{
        if( $('.item-select[data-checked=true]').length === 0 ){
          AppModel.getGeneralModel().trigger('unselected_all_item');
        }
      }
    },

    clickStar: function(ev){
      var self = this;
      var $star = $(ev.target);
      var starIdx = StarHelper.switchStar($star);

      this.starUpdating = starIdx;
      //update for the latest star click in 3 seconds
      setTimeout(function(){
        if(self.starUpdating !== null){
          self.model.save({ 'star': self.starUpdating }, {
            patch: true
          });
          self.starUpdating = null;
        }
      }, 3000);

    },

    clickTrash: function(){
      var model = this.model;
      ConfirmUtils.show({ onYes: function(){
        model.destroy();
      }});
    },

    clickStudiedTimes : function(ev){
      if(this.model.get('studied_times').length > 0){
        var modalView = new StudiedTimesModalView({
          model: this.model
        });
        $(ev.target).closest('.progress').append(modalView.render().el);
        modalView.$el.fadeIn(500);
      }

    },

    selectAllItem: function(){
      this.$('.item-select').attr('data-checked', 'true');
    },

    unselectAllItem: function(){
      this.$('.item-select').attr('data-checked', 'false');
    },

    gotoEdit: function(){
      TransitionHelper.gotoEdit(
        new StudyItemEditView({ model: this.model }));
    }

  });
  return StudyItemView;
});