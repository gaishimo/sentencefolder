({
    name: "app",
    baseUrl: "public/javascripts/app",
    out: "public/javascripts/main-built.js",
    paths: {
      'jquery': '../require-jquery-1.9.1',
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
        deps: [ 'underscore' ]
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
})