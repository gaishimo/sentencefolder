define([ './modal', '../helper/item_select', '../helper/select2', 'select2',  'backbone'],
    function(ModalView, ItemSelectHelper, Select2Helper){
  var TagModalAddView = ModalView.extend({
    id: 'add-tag-modal',
    className: 'edit-tag-modal',
    template: _.template($('#tmpl-add-tag-modal').html()),

    events: _.extend({}, ModalView.prototype.events, {
      'click .edit-tag-modal-add': 'addTags'
    }),

    render: function(){
      ModalView.prototype.render.call(this);
      this.$el.html(this.template());
      return this;
    },

    setSelect2: function(){
      var self = this;
      var $tagInput = this.$('.edit-tag-modal-tags');
      Select2Helper.createOneForTags($tagInput, 10, true);
      $tagInput.on('change', function(ev, data){
          var val = ev.val;
          if(val.length === 0){
            self.$('button').hide();
          }else{
            self.$('button').show();
          }
        });
    },

    addTags: function(){
      var self = this;

      var inputtedTags = this.$('.edit-tag-modal-tags').select2('val');
      var targetModels = ItemSelectHelper.getSelectedModels(this.collection);
      _.each(targetModels, function(model){
        var tags = model.get('tags') || [];
        tags = _.unique( tags.concat(inputtedTags) );
        model.save({ tags: tags }, { patch: true, success: function(model){
          model.formattedTags();  //re-run the computation
          model.trigger('update_tags');
        }});
      });
      this.close();
    }

  });
  return TagModalAddView;
});