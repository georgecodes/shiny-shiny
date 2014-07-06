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
        }
    });

    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', ['build']);
}