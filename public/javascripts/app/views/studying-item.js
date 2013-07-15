define(['../models/app_model', '../helper/slider', '../helper/star', 'backbone'],
    function( AppModel, SliderHelper, StarHelper ){

  var StudyingItemView = Backbone.View.extend({

    className: 'studying-item hide',

    pointUpdating: null,
    starUpdating: null,
    template: _.template($('#tmpl-studying-item').html()),

    events: {
      'click .star-button': 'changeStar',
      'click .studying-item-desc-switch': 'switchDescriptionDisp',
      'click .sentence-item': 'switchSentenceItemDisp',
      'click .studying-item-finish-study': 'switchStudyingStatus',
      'click .studying-item-goto-next': 'gotoNext',
      'click .studying-item-sub-sentence': 'speakSubSentence',
      'click .speaker': 'speakMainSentence',
      'change .studying-item-param': 'reflectParam',

      'touchstart': 'onTouch',
      'touchmove': 'onTouch',
      'touchend': 'onTouch'
    },

    render: function(){
      this.$el.html(this.template(this.model));
      if(this.model.get('param_sets').length > 0){
        this.reflectParam();
      }
      return this;
    },

    setPointClass: function(pointVal){
      if(_.isUndefined(pointVal)){
        pointVal = this.model.get('point');
      }
      $('.studying-item')
        .removeClass(SliderHelper.getPointClasses().join(' '))
        .addClass('point-'+ pointVal);
    },

    afterDomAttached: function(){
      var self = this;

      var $slider = this.$('.studying-item-slider');
      var $point = this.$('.studying-item-point-num');
      SliderHelper.setSlider($slider, $point,
        this.model.get('point'), function afterChanged(pointVal){

          self.setPointClass(pointVal);
          self.pointUpdating = pointVal;

          //update for the latest slider operation in 2 seconds
          setTimeout(function(){
            if(self.pointUpdating !== null){
              self.model.save({ 'point': self.pointUpdating }, {
                patch: true,
                success: function(model){
                  console.log("model", model);
                  model.trigger('update_point');
                }
              });
              self.pointUpdating = null;
            }
          }, 2000);
        }
      );

    },

    reflectParam: function(ev){
      var paramSets = _.map(this.$('.studying-item-param'), function(select){
        var $select = $(select);
        var $option = $select.children('option:selected');
        return {
          name: $select.attr('name'),
          question: $option.attr('data-question') || $option.attr('data-answer'),
          answer: $option.attr('data-answer')
        };
      });

      this.$('.studying-item-sentences div.answer>p,.studying-item-sentences div.question>p').each(function(){
        var $textEl = $(this);
        var textForEdit = $textEl.attr('data-original-text');
        _.each(paramSets, function(paramSet){
          var word = $textEl.parent().hasClass('question') ?
             paramSet.question: paramSet.answer;
          var regex = new RegExp('\\$\\{'+ paramSet.name + '\\}', 'gi');
          textForEdit = textForEdit.replace(regex,
              '<em>' + _.str.escapeHTML(word) + '</em>');
        });
        $textEl.html(textForEdit);
      });

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
      var $btn = this.$('.studying-item-finish-study');
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
          $('.studying-item').css( "left", -this.diffX );
        }
      }else if(ev.type === "touchend"){
        if(this.diffX > 100){
          ev.preventDefault();
          this.gotoNext();
        }else if(this.diffX > 5){
          ev.preventDefault();
          $( '.studying-item' ).animate({ left: 0 }, 200);
        }
      }
    },

    gotoNext: function(){
      var finishThis = this.$('.studying-item-finish-study').attr('data-studied') === 'true';
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
            patch: true,
            success: function(model){
              model.trigger('update_star');
            }
          });
          self.starUpdating = null;
        }
      }, 3000);
    },

    speak: function(text){
      var $playing = $('.studying-speaking');
      var a = new Audio('/speak?sentence=' + text);

      a.play();
      $playing.addClass('studying-speaking-loading')
        .addClass('icon-spin').show();
      a.addEventListener('playing', function(){
        $playing.removeClass('studying-speaking-loading')
            .removeClass('icon-spin')
            .addClass('studying-speaking-playing');
      });
      a.addEventListener('ended', function(){
        $playing.hide().removeClass('icon-spin')
            .removeClass('studying-speaking-playing');
      });
    },

    speakMainSentence: function(ev){
      var $target = $(ev.target);
      if($target.hasClass('icon-play-circle')){
        var text = $target.parents('div')
          .siblings('.sentence-item').find('.answer>p').text();
        this.speak(text);
      }
    },

    speakSubSentence: function(ev){
      var $li = $(ev.target).closest('li');
      var text = $li.find('.answer>p').text();
      this.speak(text);
    }

  });
  return StudyingItemView;
});