/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    rsync: {
      "production":{ 
        options: {
          src: "./",
          dest: "/var/www/api.madelinemanson.com/app",
          host: "myaws",
          recursive: true,
          syncDest: true
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['imagemin', 'concat', 'compass', 'uglify']);
  grunt.registerTask('deploy', ['rsync:production']);
};