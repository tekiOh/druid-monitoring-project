module.exports = function(grunt) {
  var spriteConfig = require('./sprite.config.js');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          includePaths: [],
          sourceMap: true,
          outputStyle: 'compressed'
        },
        files: {
            'client/dist/dbp/css/dbp.css': 'client/sass/dbp/style.scss',
            'client/dist/cmm/css/cmm.css': 'client/sass/cmm/style.scss'
        }
      }
    },
    sprite: {
        'dbp': spriteConfig('dbp','1x'),
        'cmm': spriteConfig('cmm','2x')
    },
    watch: {
        all: {
            files: [
                'client/images/**/*.png',
                'client/sass/**/*.scss'
            ],
            tasks: ['sass', 'sprite']
        }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dist', ['sprite', 'sass:dist']);
}
