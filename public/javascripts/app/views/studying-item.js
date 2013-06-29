define(['../models/app_model', '../helper/slider', '../helper/star', 'backbone'],
    function( AppModel, SliderHelper, StarHelper ){
  'use strict';
  var StudyingItemView = Backbone.View.extend({

    className: 'item-panel hide',

    pointUpdating: null,
    starUpdating: null,
    template: _.template($('#tmpl-studying-item').html()),

    events: {
      'click .star-button': 'changeStar',
      'click .description-disp-switch': 'switchDescriptionDisp',
      'click .sentence-item': 'switchSentenceItemDisp',
      'click .finish-study': 'switchStudyingStatus',
      'click .goto-next': 'gotoNext',
      'touchstart': 'onTouch',
      'touchmove': 'onTouch',
      'touchend': 'onTouch'
    },

    render: function(){
      this.$el.html(this.template(this.model));
      return this;
    },

    afterDomAttached: function(){
      var self = this;
      var $slider = this.$('.slider');
      var $point = this.$('.point span');
      SliderHelper.setSlider($slider, $point,
        this.model.get('point'), function afterChanged(pointVal){
          $('#studying')
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

    switchDescriptionDisp: function(){
      this.$('.description-text').fadeToggle();
    },

    switchSentenceItemDisp: function(ev){
      var $target = $(ev.target);

      if(!$target.hasClass('sentence-item')){
        $target = $target.closest('.sentence-item');
        ev.stopPropagation();
      }
      if($target.attr('data-is-showing') === 'false'){
        $target.children('.memo,i').addClass('hide');
        $target.children('.sentence-text')
          .hide()
          .removeClass('hidden')
          .fadeIn(400, function(){
              $target.attr('data-is-showing', true);
            }
          );

      }else{
        $target.children('.sentence-text').fadeOut(400, function(){
          $(this).addClass('hidden');
          $target.children('.memo,i').removeClass('hide');
           $target.attr('data-is-showing', false);
        });
      }
    },

    switchStudyingStatus: function(ev){
      var $btn = this.$('.finish-study');
      if($btn.attr('data-studied') === 'false'){
        $btn.attr('data-studied', true).children('span').text('学習済');
        $btn.children('i').switchClass('icon-check-empty', 'icon-check');
      }else{
        $btn.attr('data-studied', false).children('span').text('学習済にする');
        $btn.children('i').switchClass('icon-check', 'icon-check-emtpy');
      }
    },

    onTouch: function(ev){
      var $target = $(ev.target);
      var touch = ev.originalEvent.touches[0];

      if($target.hasClass('dragger') ||
          $target.hasClass('sentence-item') ||$target.prop('tagName') === 'i'){
        return;
      }

      if(ev.type === "touchstart"){
        this.startX = touch.pageX;
      }else if(ev.type === "touchmove"){
        this.diffX = this.startX - touch.pageX;
        if(this.diffX > 5){
          ev.preventDefault();
          $('.item-panel').css( "left", -this.diffX );
        }
      }else if(ev.type === "touchend"){
        if(this.diffX > 100){
          ev.preventDefault();
          this.gotoNext();
        }else if(this.diffX > 5){
          ev.preventDefault();
          $( '.item-panel' ).animate({ left: 0 }, 200);
        }
      }
    },

    gotoNext: function(){
      var finishThis = this.$('.finish-study').attr('data-studied') === 'true';
      AppModel.getGeneralModel().trigger('goto_next_item', finishThis);
    },

    changeStar: function(ev){
      var self = this;
      var $star = this.$('.star-button i');
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
    }

  });
  return StudyingItemView;
});