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
                    'js/scheduler.js',
                    'js/init.js',
                    'js/post.js'],
                dest: 'dist/script.js'
            }
        },
        uglify: {
            dist_js: {
                files: {
                    'dist/script.js': ['dist/script.js']
                }
            }
        },
        cssmin: {
            minify: {
                src: ['css/style.css'],
                dest: 'dist/style.css'
            }
        },
        htmlmin: {                                       // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'dist/index.html': 'html/index.html'  //dest: src
                }
            }
        }/*,
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, flatten: true, src: ['css/*', 'html/*'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        }*/
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Default task(s).
    grunt.registerTask('default', ['concat', /*'copy',*/ 'uglify', 'cssmin', 'htmlmin']);
    grunt.registerTask('nomin', ['concat', 'cssmin', 'htmlmin']);

};