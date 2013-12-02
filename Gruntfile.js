module.exports = function(grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			files: ['Gruntfile.js', 'lib/*.js']
		},
		uglify: {
			IE8vanilla: {
				files: {
					'vanillajs/dest/heart.ie8.min.js': ['vanillajs/lib/polyfills/eventPolyfill.js', 'vanillajs/lib/heart.js', 'vanillajs/lib/events.js']
				}
			},
			vanilla: {
				files: {
					'vanillajs/dest/heart.min.js': ['vanillajs/lib/polyfills/customEvent.js', 'vanillajs/lib/heart.js', 'vanillajs/lib/events.js']
				}
			},
			jquery: {
				files: {
					'jquery/dest/heart.min.js': ['jquery/lib/heart.js', 'jquery/lib/events.js']
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
	grunt.registerTask('travis', ['jshint', 'qunit']);

};
