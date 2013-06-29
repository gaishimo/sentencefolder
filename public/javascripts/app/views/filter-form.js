define(['../models/app_model', '../utils/studied_range', '../utils/input', '../helper/star', 'select2', 'range-slider', 'tiptip', 'backbone'],
    function(AppModel, StudiedRangeUtil, InputUtils, StarHelper){
  'use strict';
  var FilterFormView = Backbone.View.extend({

    starSearching: null,

    template: _.template($('#tmpl-filter-form').html()),

    events: {
      'click .icon-star,.icon-star-empty': 'clickStar',
      'keypress #text-search': 'onKeyPress'
    },

    initialize: function(){
      var self = this;
      this.listenTo(AppModel.getGeneralModel(),
         'change_sort',  this.onChangeSort);
    },

    onChangeSort: function(){
      var self = this;
      var sortVal = parseInt($('#list-operate-panel .sort select').val(), 10);
      console.log("sortVal", sortVal);
      this.collection.comparator= function(s){
        if(sortVal === -1){
          return -( moment(s.get("created_at")).unix() );
        }else if(sortVal === 1){
          return ( moment(s.get("created_at")).unix() );
        }else if(sortVal === -2){
          return -( moment(s.get("last_studied_time")).unix() );
        }else{
          return ( moment(s.get("last_studied_time")).unix() );
        }
      };
      this.collection.reset();
      this.loadRecords();

    },

    render: function(){
      this.$el.html(this.template({}));
      this.$('.tooltip').tipTip();
      return this;
    },

    loadRecords: function(){
      var pointRange = $('#range-slider-point').rangeSlider('values');
      var lastStudyRange = $('#range-slider-last-study').rangeSlider('values');
      var tags = $('#search-tags').select2('val');
      var starIdx = parseInt( this.$('.star-button>i').attr('data-star-idx'), 10);
      var text = this.$('#text-search').val().trim();
      var text_lang = this.$('#text-lang').val();
      var params = {};
      var studiedRangeSetting = StudiedRangeUtil.getSetting();
      var sort = parseInt($('#list-operate-panel .sort select').val(), 10);
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

      this.collection.fetch({ data: params });
      AppModel.setFilterModel(new Backbone.Model(params));

    },

    setRangeSlider: function(){
      var self = this;
      var $pointRange = $('#range-slider-point').rangeSlider({
        bounds: {min: 0, max: 100},
        step: 10,
        arrows: false,
        formatter:function(val){
          return val + '%';
        }
      });
      $pointRange.rangeSlider("values", 0, 100);
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
      $laststudyRange.rangeSlider("values", 0, 12);
      $laststudyRange.on('userValuesChanged', function(e, data){
        self.loadRecords();
      });

    },

    setSelect2: function(){
      var self = this;
      $('#search-tags')
        .select2({ tags: ['AAAA', 'BBBBB'], maximumSelectionSize: 3 })
        .on('change', function(){
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
      var $star = $(ev.target);
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