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
			IE8: {
				files: {
					'dest/heart.ie8.min.js': ['lib/polyfills/eventPolyfill.js', 'lib/heart.js', 'lib/events.js']
				}
			},
			normal: {
				files: {
					'dest/heart.min.js': ['lib/polyfills/customEvent.js', 'lib/heart.js', 'lib/events.js']
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
