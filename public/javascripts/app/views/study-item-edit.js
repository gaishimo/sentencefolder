define([ '../models/app_model', '../helper/transition', 'select2', 'backbone'],
    function(AppModel, TransitionHelper){
  'use strict';

  var controlEditIconShowing = function($rows){
    $rows.each(function(i, row){
      var $row = $(row);
      if(i === 0){
        $row.find('.icon-arrow-up').hide();
        if($rows.length === 1){
          $row.find('.icon-arrow-down').hide();
        }else{
          $row.find('.icon-arrow-down').show();
        }
      }else if(i === ($rows.length -1) ){
        $row.find('.icon-arrow-down').hide();
        if($rows.length === 1){
          $row.find('.icon-arrow-up').hide();
        }else{
          $row.find('.icon-arrow-up').show();
        }
      }else{
        if($rows.length !== 1){
          $row.find('.icon-arrow-up').show();
          $row.find('.icon-arrow-down').show();
        }
      }
    });
  };

  var exChangeRow = function($first, $second){
    var firstPosition = $first.position();
    var secondPosition = $second.position();

    var topDiff = secondPosition.top - firstPosition.top;
    $second.animate({ 'top': '-=' + topDiff + 'px' }, 500, function(){
    });
    $first.animate({ 'top': '+=' + topDiff + 'px' }, 500, function(){
      $first.insertAfter($second);
      $second.css('top', 0);
      $first.css('top', 0);
      controlEditIconShowing($second.closest('ul').children('li'));
    });
  }

  var addDialogRow = function($button, $dialogList, templateDialog){
    var rowNum = $dialogList.children('li').length;
    if( rowNum < 5){
      $dialogList.append(templateDialog());
      $dialogList.children('li:last-child').fadeIn(function(){
        $(this).find('textarea').eq(0).focus();
      });
      if(rowNum === 4){
        $button.hide();    //hide add button at over 4
      }
    }
    controlEditIconShowing($dialogList.children('li'));
  }



  var StudyItemEditView = Backbone.View.extend({

    tagName: 'div',
    id: 'study-item-edit',

    events: function(){
      return{
        'click .back-to-list': _.debounce(this.comeBackToList, 1000, true),
        'click .icon-trash': 'removeRow',
        'click .icon-arrow-up': 'moveRowUp',
        'click .icon-arrow-down': 'moveRowDown',
        'click .add-answer': 'addAnswerRow',
        'click .add-dialog-before-row': 'addDialogBeforeRow',
        'click .add-dialog-after-row': 'addDialogAfterRow',
        'click #add-param-set-row': 'addParamSetRow',
        'click .add-param-row': 'addParamRow',
        'click .advanced-setting-switch': 'switchAdvancedSettingShowing',
        'focus input,textarea,select': 'onFocusInput',
        'blur input,textarea,select': 'onBlurInput',
        'change .basic textarea[name=question]': 'onQuestionTextChange',
        'change .basic li:first-child textarea[name=sentence]': 'onAnswerTextChange',
        'click .save-item': 'save',
      }
    },

    template: _.template($('#tmpl-study-item-edit').html()),
    templateAnswer: _.template($('#tmpl-answer-row').html()),
    templateDialog: _.template($('#tmpl-dialog-row').html()),
    templateParamSet: _.template($('#tmpl-param-set-row').html()),
    templateParam: _.template($('#tmpl-param-row').html()),

    render: function(){
       this.$el.html(this.template(this.model));
       this.$el.fadeIn();
      return this;
    },

    onFocusInput: function(ev){
      $(ev.target).closest('.form-input').prev('label').children('p').fadeIn(500);
    },

    onBlurInput: function(ev){
      var $targetEl = $(ev.target);
      $targetEl.closest('.form-input').prev('label').children('p').fadeOut(500);
      if($targetEl.hasClass('error')){
        $targetEl.removeClass('error');
      }
    },

    onQuestionTextChange: function(ev){
      this.$('.dialog-main-question').text($(ev.target).val());
    },

    onAnswerTextChange: function(ev){
      this.$('.dialog-main-answer').text($(ev.target).val());
    },

    doAfterViewShowed: function(){
      //this method should be called after when view is attached to DOM

      //select2 setting
      var tagInput = this.$('.tags>input');
      var tags = tagInput.attr('data-values') || '';
      var tagsArray  = tags.split(',');

      tagInput
          .select2( { tags:tagsArray, maximumSelectionSize: 5 } )
          .select2( 'val', tagsArray);
    },

    comeBackToList: function(ev){
      var self = this;
      TransitionHelper.comeBackToList(this, function(){
        var id;
        if(self.model){
          id = self.model.get('_id');
          var studyItemElPos = $('.study-item[data-id=' + id + ']');
          if(studyItemElPos.length > 0){
            $('body').animate({ scrollTop: studyItemElPos.position().top - 260 }, 10);
          }
        }
      });

    },

    removeRow: function(ev){
      var $row = $(ev.target).closest('li');
      var $ul = $row.closest('ul');
      var $rows = $row.parent().children('li');
      var rowIdx = $rows.index($row);

      if($rows.length === 1){
        $row.fadeOut(700, function(){
          $(this)
            .find('textarea,input').val('').end()
            .find('.param-list li').not(':first-child').remove().end().end()
            .fadeIn(500, function(){
              $(this).find('textarea:first-child,input:first-child').focus();
            });
        });
      }else{
        $row.fadeOut(700, function(){
          $(this).remove();
          controlEditIconShowing($ul.children('li'));
          //show add button
          $( '#' + $ul.attr('data-add-button-id') ).show();
        });
      }

    },

    moveRowUp: function(ev){
      var $row = $(ev.target).closest('li');
      var $prevRow = $row.prev();
      exChangeRow($prevRow, $row);
    },

    moveRowDown: function(ev){
      var $row = $(ev.target).closest('li');
      var $nextRow = $row.next();
      exChangeRow($row, $nextRow);
    },

    addAnswerRow: function(ev){
      var answerList = this.$('.answer-list');
      var rowNum = answerList.children('li').length;
      ev.preventDefault();
      if( rowNum < 5){
        answerList.append(this.templateAnswer());
        answerList.children(':last-child').fadeIn(function(){
          $(this).find('textarea:first-child').focus();
        });
        if(rowNum === 4){
          $(ev.target).hide();    //hide add button at over 4
        }
      }
      controlEditIconShowing(answerList.children('li'));
    },

    addParamSetRow: function(ev){
      ev.preventDefault();
      var $paramSetList = $(ev.target).siblings('ul');
      var rowNum = $paramSetList.children('li').length;
      ev.preventDefault();
      if( rowNum < 3){
        $paramSetList.append(this.templateParamSet({ idx: rowNum }));
        $paramSetList.children(':last-child').fadeIn(function(){
          $(this).find('input:first-child').focus();
        });
        if(rowNum == 2){
          $(ev.target).hide();    //hide add button at over 3
        }
      }
      controlEditIconShowing($paramSetList.children('li'));
    },

    addParamRow: function(ev){
      ev.preventDefault();
      try{
      var $paramList = $(ev.target).siblings('ul');
      var rowNum = $paramList.children('li').length;
      ev.preventDefault();
      if( rowNum <= 4){
        $paramList.append(this.templateParam());
        $paramList.children(':last-child').fadeIn(function(){
          $(this).find('input:first-child').focus();
        });
        if(rowNum == 4){
          $(ev.target).hide();    //hide add button at over 4
        }
      }
      controlEditIconShowing($paramList.children('li'));
    }catch(e){console.log(e.stack);}
    },

    addDialogBeforeRow: function(ev){
      ev.preventDefault();
      var $dialogList = this.$('.dialog-before-list');
      addDialogRow($(ev.target), $dialogList, this.templateDialog);
   },

    addDialogAfterRow: function(ev){
      ev.preventDefault();
      var $dialogList = this.$('.dialog-after-list');
      addDialogRow($(ev.target), $dialogList, this.templateDialog);
   },

   switchAdvancedSettingShowing: function(ev){
     var $switch = $(ev.target);
     if($switch.hasClass('icon-caret-right')){
       this.$('.param-sets').fadeIn();
       $switch.switchClass('icon-caret-right', 'icon-caret-down', 200);
     }else{
      this.$('.param-sets').fadeOut();
       $switch.switchClass('icon-caret-down', 'icon-caret-right', 200);
     }
   },

    save: function(ev){
      var self = this;
      ev.preventDefault();
      var isCreate = this.model.isNew();

      if(!this.checkRequiredValues()){
        return;
      }

      var itemInputs = this.getValuesFromForm();

      this.$('.save-item i').addClass('icon-spin');

      this.model.save(itemInputs, {
        patch: true,
        success: function(model, response, options){
          setTimeout(function(){
            var $message = self.$('.update-message');
            self.$('.save-item i').removeClass('icon-spin');
            $message.fadeIn(1000, function(){
              setTimeout(function(){
                $message.fadeOut();
              }, 3000);
            });
          }, 500);

          if(isCreate){
            model.set('isNew', true);
            self.$('.sentence-id p').text(model.get('sentence_id'))
            self.$('.sentence-id').show();
            AppModel.getGeneralModel().trigger('create_new_item');
            AppModel.getSentenceList().add(model);
          }else{
            model.trigger('update_item');
          }
        },
        error: function(){
          console.log("error");
          alert('http error');
        }
      });


    },

    checkRequiredValues: function(){
      var $question = this.$('.basic textarea[name=question]');
      if($question.val().trim() === ''){
        $question.addClass('error').focus();
        return false;
      }
      return true;
    },

    getValuesFromForm: function(){
      var  self = this;
      var inputs = {};
      inputs.question = this.$('.basic [name=question]').val().trim();
      inputs.answers =
        _.chain(this.$('.basic .answer-list>li'))
        .map( function(li){
          var sentence = $(li).children('[name=sentence]').val().trim();
          var memo = $(li).children('[name=memo]').val().trim();
          if( sentence !== ''){
            return {
              sentence: sentence,
              memo: memo
            };
          }
        }).filter(function(r){
          return r !== undefined;   //pass over a record whose fields are all empty.
        }).value();


      inputs.situation = this.$('.basic input[name=situation]').val().trim();
      inputs.description = this.$('.basic textarea[name=description]').val().trim();
      inputs.tags = this.$('.tags>input').select2('val');
      inputs.dialog = {};
      _.each( ['before', 'after'], function(identifier){
        var $items = self.$(_.str.sprintf('.dialog-%s ul>li', identifier));
        inputs.dialog[identifier] =
           _.chain($items)
             .map(function(li){
                var question = $(li).children('[name=question]').val().trim();
                var answer = $(li).children('[name=answer]').val().trim();
                if(question !== '' || answer !== ''){
                  return {
                    speaker: parseInt( $(li).children('[name=speaker]').val(), 10),
                    question: question,
                    answer: answer
                  };
                }
            }).filter(function(r){
              return r !== undefined;
            }).value();
      });

      inputs.param_sets =
        _.chain(this.$('#param-set-list>li'))
          .map(function(setLi){
            var $setLi = $(setLi);
            var param_name = $setLi.find('input[name=param_name]').val().trim();
            if(param_name !== ''){
              return {
                param_name: param_name,
                params:
                  _.chain($setLi.find('ul.param-list>li'))
                    .map( function(paramLi){
                      var $paramLi = $(paramLi);
                      var question = $paramLi.children('[name=question]').val().trim();
                      var answer = $paramLi.children('[name=answer]').val().trim();
                      if(question !== '' || answer !== ''){
                        return {
                          question: question,
                          answer: answer
                        };
                      }
                    }).filter(function(r){
                      return r !== undefined;
                    }).value()
              };
            }
          }).filter(function(r){
            return r !== undefined;
          }).value();
      return inputs;
    }


  });
  return StudyItemEditView;
});