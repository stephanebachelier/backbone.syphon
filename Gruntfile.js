/*global module:false*/
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    meta: {
      banner: '// Backbone.Syphon, v<%= grunt.file.readJSON("bower.json").version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Derick Bailey, Muted Solutions, LLC.\n' +
        '// Distributed under MIT license\n' +
        '// http://github.com/derickbailey/backbone.syphon\n'
    },

    jshint: {
      files: ['src/*.js']
    },

    rig: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        files: {
          'lib/backbone.syphon.js': ['src/backbone.syphon.js']
        }
      },
      amd: {
        files: {
          'lib/amd/backbone.syphon.js': ['src/amd.js']
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      standard: {
        src: ['lib/backbone.syphon.js'],
        dest: 'lib/backbone.syphon.min.js'
      },
      amd: {
        src: ['lib/amd/backbone.syphon.js'],
        dest: 'lib/amd/backbone.syphon.min.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'rig', 'uglify']);

};
