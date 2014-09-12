/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    compass: {
      dist: {
        options: {
          require: 'sass-css-importer',
          httpPath: '',
          cssDir: 'public/css/',
          sassDir: 'styles/',
          imagesDir: 'public/images/',
          javascriptsDir: 'public/js/',
          fontsDir: 'public/fonts/',
          outputStyle: 'compressed'
        }
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/sidr/jquery.sidr.min.js',
          'bower_components/rangeslider.js/dist/rangeslider.js',
          'bower_components/jquery-waypoints/waypoints.js',
          'bower_components/jquery-waypoints/shortcuts/sticky-elements/waypoints-sticky.js',
          'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
          'js/main.js'
        ],
        dest: 'public/js/script.min.js'
      },
      modernizr: {
        src: [
          'bower_components/modernizr/modernizr.js'
        ],
        dest: 'public/js/vendor/modernizr.min.js'
      }
    },
    uglify: {
      dist: {
        src: [          
          'public/js/script.min.js'
        ],
        dest: 'public/js/script.min.js'
      },
      modernizr: {
        src: [          
          'public/js/vendor/modernizr.min.js'
        ],
        dest: 'public/js/vendor/modernizr.min.js'
      }
    },
    watch: {
      compass: {
        files: [
          'styles/**/**'          
        ],
        tasks: ['compass'],
        options: {
          livereload: true,
          outputStyle: 'compressed'
        }
      },
      views: {
        files: [
          'views/**/**'          
        ],
        options: {
          livereload: true
        }
      },
      js: {
        files: [
          'js/*.*',
        ],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      }
    },
    rsync: {
      "staging": {
        src: "./",
        dest: "/var/www/www.madelinemanson.com/app",
        host: "myaws",
        recursive: true,
        syncDest: true
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/'
        }]
      }
    },
    shell: {
      serve: {
        command: [
          'node app.js',
          ' grunt watch'
        ].join('&')
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['imagemin', 'concat', 'compass', 'uglify']);
  grunt.registerTask('deploy', ['imagemin', 'compass', 'concat', 'uglify', 'rsync:staging']);
  grunt.registerTask('serve', ['shell:serve']);

};