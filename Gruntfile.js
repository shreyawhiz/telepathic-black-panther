module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dist: {
				src: ['src/**/*.js', 'node_modules/cookies-js/src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			dev: {
				files: {
					'dev/js/<%= pkg.name %>.js': ['src/**/*.js'],
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= browserify.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', "test/**/*.js"],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['browserify:dev','jshint','karma:unit'],
			options: {
				livereload: true,
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			sauce: {
				configFile: 'karma.conf-sauce.js'
			}
		},
		express: {
			all: {
				options: {
					port: 3123,
					hostname: "0.0.0.0",
					bases: ["dev","src","dist"],
					livereload: true
				}
			}
		},
		open: {
			devserver: {
				path: 'http://localhost:3123'
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-express');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['jshint', 'karma:unit']);
	grunt.registerTask('test-sauce', ['karma:sauce']);
	grunt.registerTask('build', ['browserify:dist','browserify:dev','uglify']);

	grunt.registerTask('dev', ['browserify:dev', 'express', 'open:devserver', 'watch']);	
};