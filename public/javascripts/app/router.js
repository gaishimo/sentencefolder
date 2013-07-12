define(['backbone'],function(){

  //singleton
  var AppRouter = function(){
    var instance = this;
    var router;
    var Router = Backbone.Router.extend({
      initialize: function(options){
        this.filterView = options.filterView;
      },
      routes: {
        '' : 'root',
        'filter/:query': 'filter'
      },

      root: function(){
        this.filterView.loadRecords();
      },

      filter: function(query){
        if(!this.filterView){
          console.log("filterView not exist");
          return;
        }
        this.filterView.loadByFilters(query);
      }
    });

     this.initialize = function(filterView){
       router = new Router({ filterView: filterView });
       Backbone.history.start();
     };

    this.get = function(){
      return router;
    }

    AppRouter = function(){
      return instance;
    }
  };
  return new AppRouter();
});