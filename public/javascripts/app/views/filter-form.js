'use strict';

define([
  '../models/app_model',
  '../router',
  '../utils/studied_range',
   '../utils/input',
   '../helper/star',
   '../helper/select2',
   '../utils/parse-params',
   'viewport',
   'select2',
   'range-slider',
   'tiptip',
   'backbone'],
    function(AppModel, Router, StudiedRangeUtil,
      InputUtils, StarHelper, Select2Helper, parseParams, viewport){

  var isMobile = viewport.width < 600;

  var FilterFormView = Backbone.View.extend({

    starSearching: null,

    template: _.template($('#tmpl-filter-form').html()),

    events: {
      'click .filter-star-button': 'clickStar',
      'click .filter-refresh': 'refreshRecords',
      'keypress #text-search': 'onKeyPress',
    },

    initialize: function(){
      var self = this;
      this.listenTo(AppModel.getGeneralModel(), {
        'change_sort':  this.onChangeSort,
        'show_list_container': this.onShowListContainer
      });
    },

    onChangeSort: function(){
      var self = this;
      var sortVal = parseInt($('.operate-sort-select').val(), 10);
      this.setComperator();
      this.collection.reset();
      this.loadRecords();
    },



    onShowListContainer: function(){
      var $pointRange = $('#range-slider-point');
      var $laststudyRange = $('#range-slider-last-study');

      var vals = {
        pointRange: $pointRange.rangeSlider('values'),
        laststudyRange: $laststudyRange.rangeSlider('values')
      };
      this.unsetRangeSlider();
      this.setRangeSlider(vals);
    },

    render: function(){
      this.$el.html(this.template({}));
      this.$('.tooltip').tipTip();
      return this;
    },

    refreshRecords: function(){
      var $refreshIcon = this.$('.filter-refresh i');
      $refreshIcon.addClass('icon-spin');
      this.collection.reset();
      this.loadRecords(function(){
        $refreshIcon.removeClass('icon-spin');
      });
    },

    loadByFilters: function(query){
      var p = parseParams(query);

      if(p.point_min || p.point_max){
        p.point_min = p.point_min || "0";
        p.point_max = p.point_max || "100";
        $('#range-slider-point').rangeSlider('values',
            p.point_min, p.point_max);
      }
      if(p.last_studied_time_min || p.last_studied_time_max){
        p.last_studied_time_min = p.last_studied_time_min || "0";
        p.last_studied_time_max = p.last_studied_time_max || "99999";
        $('#range-slider-last-study').rangeSlider('values',
            StudiedRangeUtil.getValFromDay(
              parseInt(p.last_studied_time_min, 10)),
            StudiedRangeUtil.getValFromDay(
              parseInt(p.last_studied_time_max, 10))
          );
      }
      if(p.tags){
        var tags = p.tags.split(',');
        $('#search-tags').select2('val', tags);
      }
      if(p.star){
        StarHelper.setStar(this.$('.star-button>i'), parseInt(p.star));
      }
      if(p.text){
        this.$('#text-search').val(p.text);
        this.$('#text-lang').val(p.text_lang || 'ja');
      }
      if(p.sort){
        $('.operate-sort-select').val(p.sort);
        this.setComperator(parseInt(p.sort));
      }

      this.loadRecords();

    },

    loadRecords: function(callback){
      var pointRange = $('#range-slider-point').rangeSlider('values');
      var lastStudyRange = $('#range-slider-last-study').rangeSlider('values');
      var tags = $('#search-tags').select2('val');
      var starIdx = parseInt( this.$('.star-button>i').attr('data-star-idx'), 10);
      var text = this.$('#text-search').val().trim();
      var text_lang = this.$('#text-lang').val();
      var params = {};
      var studiedRangeSetting = StudiedRangeUtil.getSetting();
      var sort = parseInt($('.operate-sort-select').val(), 10);
      if(pointRange.min !== 0 || pointRange.max !== 100){
        params.point_min = pointRange.min;
        params.point_max = pointRange.max;
      }
      if(lastStudyRange.min !== 0 || lastStudyRange.max !== 12){
        params.last_studied_time_min
          = studiedRangeSetting['val-' + lastStudyRange.min].day;
        params.last_studied_time_max
          = studiedRangeSetting['val-' + lastStudyRange.max].day;
      }

      if(tags.length > 0){
        params.tags = tags.join(',');
      }

      if(starIdx !== 0){
        params.star = starIdx;
      }

      if(text){
        params.text = text;
        params.text_lang = text_lang;
      }

      if(sort !== -1){
        params.sort = sort;
      }

      this.collection.fetch({ data: params, success: callback });
      AppModel.setFilterModel(new Backbone.Model(params));
      AppModel.getGeneralModel().trigger('load_items', params);

      var query = $.param(params);
      if(query !== ''){
        Router.get().navigate('filter/' + query);
      }
    },

    setComperator: function(sortVal){
      this.collection.comparator= function(s){
        if(sortVal === -1){
          return -( moment(s.get("created_at")).unix() );
        }else if(sortVal === 1){
          return ( moment(s.get("created_at")).unix() );
        }else if(sortVal === -2){
          if(s.get("last_studied_time")){
            return -( moment(s.get("last_studied_time")).unix() );
          }else{
            return 0;
          }
        }else{
          if(s.get("last_studied_time")){
            return ( moment(s.get("last_studied_time")).unix() );
          }else{
            return 0;
          }
        }
      };
    },


    setRangeSlider: function(vals){
      var self = this;
      vals = vals || {
        pointRange: { min: 0, max: 100 },
        laststudyRange: { min: 0, max: 12}
      };
      var $pointRange = $('#range-slider-point').rangeSlider({
        bounds: {min: 0, max: 100},
        step: 10,
        arrows: false,
        formatter:function(val){
          return val + '%';
        }
      });
      $pointRange.rangeSlider("values",
            vals.pointRange.min, vals.pointRange.max);
      $pointRange.on('userValuesChanged', function(e, data){
        self.loadRecords();
      });

      var $laststudyRange = $('#range-slider-last-study').rangeSlider({
        bounds: {min: 0, max: 12},
        step: 1,
        arrows: false,
        formatter: function(val){
          var setting = StudiedRangeUtil.getSetting();
          return setting['val-' + val].text;
        }
      });
      $laststudyRange.rangeSlider("values",
            vals.laststudyRange.min, vals.laststudyRange.max);
      $laststudyRange.on('userValuesChanged', function(e, data){
        self.loadRecords();
      });

    },

    unsetRangeSlider: function(){
      this.$('#range-slider-point,#range-slider-last-study')
          .off('userValuesChanged')
          .rangeSlider('destroy');
    },

    setSelect2: function(){
      var self = this;
      var $select2 = Select2Helper.createOneForTags($('#search-tags'), 3);
      $select2.on('change', function(){
          self.loadRecords();
      });
    },

    onKeyPress: function(ev){
      if(ev.keyCode ===13){   //enter key
        this.loadRecords();
      }
    },

    clickStar: function(ev){
      var self = this;
      var $star = this.$('.filter-star-button>i');
      var starIdx = StarHelper.switchStar($star);

      this.starSearching = starIdx;
      //search for the latest star click in 1 seconds
      setTimeout(function(){
        if(self.starSearching !== null){
          self.loadRecords();
          self.starSearching = null;
        }
      }, 1000);

    },


  });
  return FilterFormView;
});