define(['../models/app_model', './studying-item', '../helper/slider', 'backbone'],
    function( AppModel, StudyingItemView, SliderHelper ){
  'use strict';
  var StudyingView = Backbone.View.extend({
    id: 'studying',
    className: 'large',
    currentItemView: null,
    currentItemModel: null,
    template: _.template($('#tmpl-studying').html()),

    changeToNextItem: function(isFinish){
      console.log("isFinish", isFinish);
      var self = this;
      this.currentItemView.$el.fadeOut(200, function(){
        $(this).remove();
        if(isFinish){
          self.addStudiedTime();
          if(self.collection.length === 1){
            alert('全てのアイテムの学習が完了しました。');
            return;
          }
          self.collection.remove(self.currentItemModel);
          console.log("self.collection", self.collection);
        }


        self.showNextItem();

      });
    },

    initialize: function(){
      this.listenTo(AppModel.getGeneralModel(),
        'goto_next_item', this.changeToNextItem);
    },

    render: function(){
      var itemNum = this.collection.length;
      this.$el.html(this.template({ itemNum: itemNum }));
      return this;
    },

    showNextItem: function(){
      var self = this;
      this.currentItemModel = this.selectItemAtRandom();
      this.currentItemView =new StudyingItemView({ model: this.currentItemModel });
      this.$('.item-num').after(this.currentItemView.render().el);

      $('#studying')
        .removeClass(SliderHelper.getPointClasses().join(' '))
        .addClass('point-' + this.currentItemModel.get('point'));

      this.currentItemView.$el.css('left', 500)
        .show()
        .animate({ left: 0}, {duration: 500, complete: function(){
          self.currentItemView.afterDomAttached();
        }});
      this.refreshItemNum();
    },

    addStudiedTime: function(){
      var now = moment(),
            nowFormatted = now.format('YYYY/MM/DD HH:mm'),
            studiedTimesFormatted = this.currentItemModel.get('formattedStudiedTimes'),
            studiedTimes;
      if(_.contains(studiedTimesFormatted, nowFormatted)){
        return;
      }
      studiedTimes = this.currentItemModel.get('studied_times');
      studiedTimes.push(now.format('YYYY-MM-DDTHH:mm:ss Z'));
      studiedTimes = _.sortBy(studiedTimes, function(d){
        return -( new Date(studiedTimes).getTime() );
      });

      this.currentItemModel.save({ 'studied_times': studiedTimes }, {
        patch: true,
        success: function(model){
          model.trigger('update_studied_times');
        }
      });
      this.currentItemModel.formattedStudiedTimes(); //refresh computed value
    },

    refreshItemNum: function(){
      var itemNum = this.collection.length;
      this.$('.item-num span').text(itemNum);
    },

    selectItemAtRandom: function(){
      var selectedIdx = Math.floor( Math.random() * this.collection.length );
      var model = this.collection.at(selectedIdx);
      return model;
    },



  });
  return StudyingView;
});