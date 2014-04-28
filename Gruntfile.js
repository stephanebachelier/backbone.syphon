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
    },

    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true
        }
      }
    },

    jasmine: {
      options: {
        helpers: ['spec/javascripts/helpers/*.js'],
        specs: ['spec/javascripts/*.spec.js'],
        vendor: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
        ],
        keepRunner: true
      },
      syphon: {
        src: [
          'src/backbone.syphon.js',
          'src/backbone.syphon.typeregistry.js',
          'src/backbone.syphon.*.js',
        ]
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'rig', 'uglify']);
  grunt.registerTask('test', ['jshint', 'jasmine', 'connect:server:keepalive']);

};
