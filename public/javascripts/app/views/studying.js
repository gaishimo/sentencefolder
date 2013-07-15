define([
    '../models/app_model',
    './studying-item',
    '../helper/slider',
    '../helper/transition',
    'backbone'],
    function( AppModel, StudyingItemView, SliderHelper, TransitionHelper ){

  var StudyingView = Backbone.View.extend({
    id: 'studying',
    className: 'studying',
    currentItemView: null,
    currentItemModel: null,
    // template: _.template($('#tmpl-studying').html()),

    events: {
      'click .studying-cancel': 'backToList'
    },

    initialize: function(){

      this.listenTo(AppModel.getGeneralModel(),
        'goto_next_item', this.changeToNextItem);
    },

    render: function(){
      var itemNum = this.collection.length;
      this.$el.html(_.template($('#tmpl-studying').html())({ itemNum: itemNum }));
      return this;
    },

    changeToNextItem: function(isFinish){
      var self = this;
      this.currentItemView.$el.fadeOut(200, function(){
        $(this).remove();
        if(isFinish){
          self.addStudiedTime();
          if(self.collection.length === 1){
            alert('全てのアイテムの学習が完了しました。');
            self.backToList();
            return;
          }
          self.collection.remove(self.currentItemModel);
        }

        self.showNextItem();

      });
    },

    showNextItem: function(){
      var self = this;

      this.currentItemModel = this.selectItemAtRandom();
      this.currentItemView =new StudyingItemView({ model: this.currentItemModel });
      this.$('.studying-item-num').after(this.currentItemView.render().el);
      this.currentItemView.setPointClass();

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
          model.formattedStudiedTimes();
          model.set('last_studied_time', studiedTimes[0]);
          model.formattedLastStudiedTime();
          model.trigger('update_studied_times');
        }
      });
      this.currentItemModel.formattedStudiedTimes(); //refresh computed value
    },

    refreshItemNum: function(){
      var itemNum = this.collection.length;
      this.$('.studying-item-num-text').text(itemNum);
    },

    selectItemAtRandom: function(){
      var selectedIdx = Math.floor( Math.random() * this.collection.length );
      var model = this.collection.at(selectedIdx);
      return model;
    },

    backToList: function(){
      TransitionHelper.comeBackToList(this);
    }

  });
  return StudyingView;
});