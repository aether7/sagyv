module.exports = function(grunt){
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:MM:s") %> */\n'
            },
            build: {
                files: {
                    'static/js/build.min.js':[
                        'static/js/vendor/jquery.min.js',
                        'static/js/vendor/bootstrap.min.js',
                        'static/js/vendor/underscore.min.js',
                        'js/plugins/jquery.cookie.min.js',
                        'js/init.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask("default", ["uglify"]);
};
