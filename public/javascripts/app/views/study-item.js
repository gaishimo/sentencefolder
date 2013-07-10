'use strict';

define([
  '../models/app_model',
  './studied-times-modal',
  './progress-modal',
  './star-select-modal',
  './study-item-edit',
  '../models/sentence',
  '../utils/confirm',
  '../helper/star',
  '../helper/slider',
  '../helper/transition',
  'viewport',
  'backbone',
  'slider',
  'tiptip'
  ],
  function(AppModel, StudiedTimesModalView,
    ProgressModal, StarSelectModal, StudyItemEditView,
    SentenceModel, ConfirmUtils,
    StarHelper, SliderHelper, TransitionHelper, viewport){

  var isMobile = viewport.width < 600;
  var templateId = isMobile  ?
        '#tmpl-study-item-mb' : '#tmpl-study-item';

  var StudyItemView = Backbone.View.extend({

    tagName: 'li',
    className: 'study-item',
    template: _.template($(templateId).html()),
    templateStudiedTimes:   _.template($('#tmpl-studied-times').html()),
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
        'click .star-button': 'clickStar',
        'click .study-item-remove': 'clickTrash',
        'click .study-item-duplicate': 'duplicateItem',
        'click .study-item-studied-times, .study-item-last-studied-time': 'clickStudiedTimes',
        'click .study-item-title': _.debounce(this.gotoEdit, 1000, true),
        'click .point': 'clickPoint'
      }
    },


    remove: function(){
      Backbone.View.prototype.remove.call(this);
      this.unsetSlider();
    },

    render: function(model){
      var self = this;
      this.$el.html(this.template(this.model));
      if(!isMobile){
        this.renderStudiedTimes();
      }

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

      if(isMobile) return;

      var $slider = this.$('.study-item-slider');
      var $point = this.$('.study-item-progress-point .point')
      SliderHelper.setSlider($slider, $point,
        this.model.get('point'), function(pointVal){
          $slider.closest('.study-item-container')
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
      var $star = this.$('.star-button>i');
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
      console.log("clickTrash");
      var model = this.model;
      ConfirmUtils.show({ onYes: function(){
        model.destroy();
      }});
    },

    duplicateItem: function(){
      console.log("duplicateItem");
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
          model: this.model,
          isMobile : isMobile
        });
        var elementAppendTo = isMobile ?
            this.$('.study-item-mb-progress'): this.$('.study-item-progress');
        elementAppendTo.append(modalView.render().el);
        modalView.$el.fadeIn(500);
      }

    },

    clickPoint: function(){
      var modal;
      if(isMobile){
        modal = new ProgressModal({
            model: this.model, studyItemEl: this.$el
          }).render();
        modal.setSlider();
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