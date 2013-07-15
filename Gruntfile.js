module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.initConfig({
    compass: {
      dist: {
        options: {
          config: 'public/config.rb'
        }
      },
      dev: {
        options: {
          config: 'public/config.rb'
        }
      }
    },
    watch:{
      compass:{
        files: [ 'public/sass/*.scss' ],
        tasks: [ 'compass:dev' ]
      }
    },

    cssmin: {
      minify: {
        files: {
          'public/css/all.min.css':
              [
              'public/css/reset.css',
                 'public/css/select2/*.css',
                 'public/css/iThing.css',  'public/css/tiptip.css',
                 'public/css/simple-slider.css',
                 'public/css/font-awesome.css',
                 'public/css/app.css']
        }
      }

    },

    requirejs: {
      compile: {
        options:{
          name: 'index',
          baseUrl: "public/javascripts/app",
          out: "public/javascripts/main-built-new.js",
          paths: {
            'jquery': '../jquery/jquery-2.0.3.min',
            // 'require': '../require.js',
            'backbone': '../backbone/backbone',
            'backbone.compute': '../backbone/backbone.compute',
            'highlight': '../jquery/highlight/jquery.highlight',
            'jquery.ui.core': '../jquery/jquery.ui/jquery.ui.core',
            'jquery.ui.widget': '../jquery/jquery.ui/jquery.ui.widget',
            'jquery.ui.mouse': '../jquery/jquery.ui/jquery.ui.mouse',
            'jquery.ui.effect': '../jquery/jquery.ui/jquery.ui.effect',
            'jquery.ui.autocomplete': '../jquery/jquery.ui/jquery.ui.autocomplete',
            'jvent': '../jvent/jvent',
            'moment': '../moment/moment',
            'mousewheel': '../jquery/ui/mousewheel/jquery.mousewheel',
            'range-slider': '../jquery/ui/range-slider/jQAllRangeSliders-min',
            'select2': '../jquery/ui/select2/select2',
            'slider': '../jquery/ui/simple-slider/simple-slider',
            'speak': '../speak/speakClient',
            'tiptip': '../jquery/ui/tooltip/jquery.tiptip.min',
            'underscore': '../underscore/underscore',
            'underscore-string': '../underscore/underscore.string',
            'viewport': '../viewport/viewport'
          },
          shim: {
            'underscore' : {
              exports: '_'
            },
            'underscore-string' : {
              deps: [ 'underscore' ]
            },
            'viewport': {
              deps: [ 'jvent' ]
            },
            'backbone': {
              deps: [ 'underscore', 'jquery' ],
              exports: 'Backbone'
            },
            'backbone.compute': {
              deps: [ 'backbone' ]
            },
            'range-slider': {
              deps: [ 'mousewheel' ]
            },
            'mousewheel': {
              deps: [  'jquery.ui.mouse' ]
            },
            'jquery.ui.widget': {
              deps: [ 'jquery.ui.core' ]
            },
            'jquery.ui.mouse': {
              deps: [ 'jquery.ui.core', 'jquery.ui.widget' ]
            },
            'jquery.ui.effect': {
              depts: [ 'jquery.ui.core' ]
            }
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['compass:dist', 'cssmin:minify', 'requirejs:compile']);

};