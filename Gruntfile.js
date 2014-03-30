module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: [
                    'js/plugin-conf.js',
                    'js/utils.js',
                    'js/strip.js',
                    'js/roll-view.js',
                    'js/piano-view.js',
                    'js/controls.js',
                    'js/pattern-view.js',
                    'js/pattern-sequencer.js',
                    'js/piano-view.js',
                    'js/init.js',
                    'js/post.js'],
                dest: 'dist/script.js'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, flatten: true, src: ['css/*', 'html/*'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'copy']);

};