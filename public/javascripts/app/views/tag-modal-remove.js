define([ './modal', '../helper/item_select', 'select2',  'backbone'],
    function(ModalView, ItemSelectHelper){
  var TagModalRemoveView = ModalView.extend({
    id: 'remove-tag-modal',
    className: 'edit-tag-modal',
    template: _.template($('#tmpl-remove-tag-modal').html()),

    events: _.extend({}, ModalView.prototype.events, {
      'click .edit-tag-modal-remove': 'removeTags'
    }),

    render: function(){
      ModalView.prototype.render.call(this);
      var self = this;
      var selectedModels = ItemSelectHelper.getSelectedModels(this.collection);
      var alltags = [];
      _.each(selectedModels, function(m){
        var tags = m.get('tags') || [];
        if(tags.length > 0){
           alltags = alltags.concat(tags);
        }
      });
      alltags = _.unique(alltags);
      this.$el.html(this.template({ tags: alltags }));

      this.$('select').on('change', function(ev){
        self.$('button').show();
      });

      return this;
    },

    removeTags: function(){
      var self = this;
      var inputtedTags = this.$('select').val();
      var targetModels = ItemSelectHelper.getSelectedModels(this.collection);
      _.each(targetModels, function(model){
        var tags = model.get('tags') || [];
        tags = _.difference(tags, inputtedTags );
        model.save({ tags: tags }, { patch: true, success: function(model){
          model.formattedTags();  //re-run the computation
          model.trigger('update_tags');
        }});
      });
      this.close();

    }


  });
  return TagModalRemoveView;
});