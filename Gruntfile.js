module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-contrib-compass");
  grunt.loadNpmTasks("grunt-contrib-watch");

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
    }
  });



};