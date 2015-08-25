var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var rename = require('gulp-rename');

var reactApps = [
  {
    input: './static/js/apps/situacion_comercial.jsx',
    output: 'situacion_comercial.bundle.js'
  }
];

var angularApps = [];

var tasks = {
  styl: function(){
    return gulp.src('./static/css/sagyv.styl')
      .pipe(stylus({compress: true}))
      .pipe(gulp.dest('./static/css/'));
  },
  angular: function(){

  },
  react: function(){
    reactApps.forEach(function(opt){
      var choices = {
        entries: [opt.input],
        extensions: ['.js', '.jsx', '.json']
      };

      browserify(choices).transform(babelify).bundle()
      .pipe(source(opt.output))
      .pipe(gulp.dest('./static/js/bundles'));
    });
  },
  watch: function(){
    var src = './static/js/';

    gulp.watch([
      src + 'actions/*.js',
      src + 'apps/*.jsx',
      src + 'components/*.jsx',
      src + 'stores/*.js'
    ], ['react']);

    gulp.watch(['./static/css/**/*.styl'], ['styl']);
  }
};

gulp.task('styl', tasks.styl);
gulp.task('angular', tasks.angular);
gulp.task('react', tasks.react);
gulp.task('watch', tasks.watch);
gulp.task('default', ['styl', 'angular', 'react', 'watch']);
