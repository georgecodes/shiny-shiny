module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'web-app/css/main.css': 'grails-app/assets/stylesheets/scss/main.scss'
                }
            }
        },

        watch: {
            grunt: { files: ['Gruntfile.js'] },

            sass: {
                files: 'grails-app/assets/stylesheets/scss/**/*.scss',
                tasks: ['sass']
            }
        },
        bower: {
            install: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    targetDir: 'web-app/js/lib',
                    layout: function(type, component) {
                        return '';
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('build', ['sass']);
    grunt.registerTask('bootstrap', ['bower:install']);
    grunt.registerTask('default', ['build','watch']);
}