module.exports = function(grunt){

  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          'public/css/app.css': 'public/sass/app.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/css/app.css': 'public/sass/app.scss'
        }
      }
    },
    watch:{
      sass:{
        files: [ 'public/sass/*.scss' ],
        tasks: [ 'sass:dev' ]
      }
    }
  });



};