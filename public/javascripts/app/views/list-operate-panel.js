define([
  '../models/app_model',
  '../models/sentence',
  '../collections/sentences',
  '../utils/del-confirm',
  './tag-modal-add',
  './tag-modal-remove',
  './study-item-edit',
  './studying',
  '../helper/transition',
  'tiptip', 'backbone', 'jquery.ui.effect' ],
   function(AppModel, SentenceModel, SentenceCollection,
    DelConfirm, TagModalAddView, TagModalRemoveView,
    StudyItemEditView, StudyingView, TransitionHelper ){

  var ListOperatePanelView = Backbone.View.extend({
    // template: _.template($('#tmpl-list-operate-panel').html()),

    initialize: function(){
      this.listenTo(AppModel.getGeneralModel(), {
        'selected_item': this.onSelectItem,
        'unselected_all_item': this.onUnselectAllItem,
        'create_new_item': this.plusTotalCount,
      });
      this.listenTo(AppModel.getGeneralModel() ,
        'load_items', this.countRefresh);

    },

    events:{
      'click .add-new-item': 'addNewItem',
      'click .check-select-all-switch' : 'clickSelectAllSwitch',
      'click .remove-item': 'removeItem',
      'click .add-tag': 'showTagAddModal',
      'click .remove-tag': 'showTagRemoveModal',
      'click .operate-study-start': 'startStudy',
      'change .operate-sort-select': 'onChangeItemSort'
    },

    render: function(){
      this.$el.append(_.template($('#tmpl-list-operate-panel').html())({}));
      this.$('.tooltip').tipTip({ defaultPosition: 'top' });
      this.collection.count({}, { onSuccess: function(cnt){
        $('#total-cnt').text(cnt);
      }});
      return this;
    },

    countRefresh: function(param){
      this.collection.count(param, { onSuccess: function(cnt){
        $('#fetch-cnt').text(cnt);
      }})
    },

    plusTotalCount: function(){
      var $totalCnt =  $('#total-cnt');
      var cnt = parseInt($totalCnt.text(), 10);
      $totalCnt.text(++cnt);
    },

    onSelectItem: function(){
      this.$('.show-at-selected').fadeIn(300);
    },

    onUnselectAllItem: function(){
      this.$('.show-at-selected').fadeOut(300);
    },

    clickSelectAllSwitch : function(ev){
      var icon;
      if($(ev.target).find('i').length === 0){
        icon = $(ev.target);
      }else{
        icon = $(ev.target).find('i');
      }
      if(icon.hasClass('icon-check-empty')){
        AppModel.getGeneralModel().trigger('select_all_item');
        icon.switchClass( 'icon-check-empty', 'icon-check');
        this.onSelectItem();
      }else{
        AppModel.getGeneralModel().trigger('unselect_all_item');
        icon.switchClass( 'icon-check', 'icon-check-empty');
        this.onUnselectAllItem();
      }
    },

    onChangeItemSort: function(){
      AppModel.getGeneralModel().trigger('change_sort');

    },

    showTagAddModal: function(){
      var tagModalAddView = new TagModalAddView( { collection: this.collection } );
      $('body').prepend(tagModalAddView.render().el);
      tagModalAddView.setSelect2();
    },

    showTagRemoveModal: function(){
      var tagModalRemoveView = new TagModalRemoveView( { collection: this.collection } );
      $('body').prepend(tagModalRemoveView.render().el);
    },

    removeItem: function(){
      var self = this;
      DelConfirm.show({ onYes: function(){
        var targetModels = [];
        $('.study-item-select[data-checked=true]').each(function(i, item){
          var id = $(item).closest('.study-item-container').attr('data-id');
          targetModels.push( self.collection.get(id) );
        });
        _.each(targetModels, function(model){
          model.destroy();
        });
      }});
    },

    addNewItem: function(){
      TransitionHelper.gotoEdit(
        new StudyItemEditView({ model: new SentenceModel() }));
    },

    startStudy: function(){
      var self = this;
      var selectedItems = new SentenceCollection();
      //get selected models
      _.map($('.study-item-select[data-checked=true]')
                        .closest('.study-item-container'), function(item){
        var id = $(item).attr('data-id');
        selectedItems.add(self.collection.get(id));
      });
      if(selectedItems.length === 0){ console.log('no items are selected.'); return; }
      this.gotoStudy(selectedItems);
    },

    gotoStudy: function(items){
      var studyingView = new StudyingView({ collection: items });
      $('#list-container').fadeOut(500, function(){
        AppModel.getGeneralModel().trigger('hide_list_container');

        $('#main-content').append(studyingView.render().el);
        $('body').animate({ scrollTop: 0 }, 10);
        studyingView.showNextItem();
      });
    }

  });
  return ListOperatePanelView;
});