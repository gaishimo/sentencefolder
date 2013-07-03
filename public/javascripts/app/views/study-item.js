define([
  '../models/app_model',
  './studied-times-modal',
  './study-item-edit',
  '../models/sentence',
  '../utils/confirm',
  '../helper/star',
  '../helper/slider',
  '../helper/transition',
  'backbone',
  'slider',
  'tiptip'
  ],
  function(AppModel, StudiedTimesModalView, StudyItemEditView,
    SentenceModel, ConfirmUtils,
    StarHelper, SliderHelper, TransitionHelper){

  'use strict';
  var StudyItemView = Backbone.View.extend({

    tagName: 'li',
    className: 'study-item',

    template: _.template($('#tmpl-study-item').html()),
    templateStudiedTimes: _.template($('#tmpl-studied-times').html()),
    pointUpdating: null,
    starUpdating: null,

    initialize: function(){
      this.listenTo(this.model, {
        update_studied_times: this.renderStudiedTimes,
        update_tags: this.onUpdateTags,
        update_item: this.onUpdateItem
      });
      this.listenTo(AppModel.getGeneralModel(), {
        'select_all_item': this.selectAllItem,
        'unselect_all_item': this.unselectAllItem,
      });
    },

    events: function(){
      return{
        'click .study-item-select': 'clickItemSelect',
        'click .icon-star,.icon-star-empty': 'clickStar',
        'click .icon-trash': 'clickTrash',
        'click .icon-copy': 'duplicateItem',
        'click .study-item-studied-times': 'clickStudiedTimes',
        'click .study-item-title': _.debounce(this.gotoEdit, 1000, true)
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
      var $originalEl = this.$el.find('.study-item-studied-times');
      var $newEl = this.templateStudiedTimes(this.model);
      if($originalEl.length > 0){
        $originalEl.remove();
      }
      this.$el.find('.study-item-progress').append($newEl);
    },

    onUpdateItem: function(){
      this.onUpdateTags();
    },

    onUpdateTags: function(){
      var $text = this.$('.study-item-tags-text>a');
      var tags = this.model.get('formattedTags');
      var tagCollection, tagModels;

      $text.fadeOut(500, function(){
        $text.attr('title', 'タグ: ' + tags)
                .text(tags)
                .tipTip( { defaultPosition: 'top' } );
        $text.fadeIn(2000);
      });

      tagModels = _.map(this.model.get('tags'), function(tag){
        return new Backbone.Model({ tag_id: tag });
      });
      if(tagModels.length > 0){
        tagCollection = AppModel.getTagList();
        _(tagModels).each(function(tag){
          tagCollection.add(tag);
        });
      }

    },

    setSlider: function(){
      var self = this;

      var $slider = this.$('.study-item-slider');
      var $point = this.$('.study-item-progress-point')
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
      SliderHelper.unsetSlider(this.$('.study-item-slider'));
    },

    clickItemSelect: function(ev){
      var current = this.$('.study-item-select').attr('data-checked') === 'true';
      var changeTo = !current;
      this.$('.study-item-select').attr('data-checked', changeTo)

      if(changeTo){
        AppModel.getGeneralModel().trigger('selected_item');
      }else{
        if( $('.study-item-select[data-checked=true]').length === 0 ){
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

    duplicateItem: function(){
      var model = new SentenceModel(_.clone(this.model.attributes));
      delete model.attributes.created_at;
      delete model.attributes.updated_at;
      delete model.attributes.formattedUpdatedTime;
      delete model.attributes.last_studied_time;
      model.set({
        _id: null,
        sentence_id: '',
        point: 0,
        star: 0,
        studied_times: []
      });
      TransitionHelper.gotoEdit(
        new StudyItemEditView({ model: model })
      );
    },

    clickStudiedTimes : function(ev){
      if(this.model.get('studied_times').length > 0){
        var modalView = new StudiedTimesModalView({
          model: this.model
        });
        $(ev.target).closest('.study-item-progress').append(modalView.render().el);
        modalView.$el.fadeIn(500);
      }

    },

    selectAllItem: function(){
      this.$('.study-item-select').attr('data-checked', 'true');
    },

    unselectAllItem: function(){
      this.$('.study-item-select').attr('data-checked', 'false');
    },

    gotoEdit: function(){
      TransitionHelper.gotoEdit(
        new StudyItemEditView({ model: this.model }));
    }

  });
  return StudyItemView;
});