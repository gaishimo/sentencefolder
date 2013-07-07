define([ './header', './list-container', 'backbone'],
    function(HeaderView, ListContainerView){
  'use strict';
  var mainView = Backbone.View.extend({

    events: {
      'change .app-menu': 'selectAppMenu'
    },

    render: function(){
      this.headerView = new HeaderView();
      this.listContainerView = new ListContainerView({
         el: '#list-container'
      });
      $('#main-content').append(this.listContainerView.render().el);

      //detect bottom scroll
      $(document).ready(function(){
        $(window).scroll(function() {
          var current = $(window).scrollTop() + window.innerHeight;
          if (current < $(document).height() - 50) return;
          $(window).trigger('bottom');
        });
      });

      return this;
    },

    selectAppMenu: function(ev){
      var val = $(ev.target).val();
      if(val === 'logout'){
        location.href = '/logout';
      }
    }

  });
  return mainView;
});