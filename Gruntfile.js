module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: ['index.js', 'lib/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'test-results.txt',
        },
        src: ['test/**/*Spec.js']
      }
    },
    jshint: {
      all: ['index.js', 'lib/**/*.js', 'test/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'mochaTest', 'jsdoc']);

};
