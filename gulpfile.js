'use strict';

var autoprefixer = require('autoprefixer'),
    del          = require('del'),
    gulp         = require('gulp'),
    concatCss    = require('gulp-concat-css'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    plumber      = require('gulp-plumber'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    svgstore     = require('gulp-svgstore'),
    watch        = require('gulp-watch'),
    path         = require('path'),
    precss       = require('precss'),
    ftp          = require('vinyl-ftp'),

var paths = {
  jade: 'src/**/*.jade',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  icons: 'src/icons/*'
};


/* ==========================================================================
   'gulp' task
   (does nothing)
   ========================================================================== */

gulp.task('default', function() {

});


/* ==========================================================================
   'gulp build' task
   (builds 'dist' folder from 'src' folder)
   ========================================================================== */

gulp.task('build', ['clean'], function() {

  gulp.start(['html', 'css', 'js', 'img', 'icons']);

});


/* ==========================================================================
   'gulp watch' task
   (watches for changes in source folders and automatically runs tasks
   to process these changes)
   ========================================================================== */

gulp.task('watch', function() {

  watch( paths.jade,  function() { gulp.start('html');  });
  watch( paths.css,   function() { gulp.start('css');   });
  watch( paths.js,    function() { gulp.start('js');    });
  watch( paths.img,   function() { gulp.start('img');   });
  watch( paths.icons, function() { gulp.start('icons'); });

});


/* ==========================================================================
   'gulp html' task
   (compile .jade files to .html files)
   ========================================================================== */

gulp.task('html', function() {

  gulp.src('src/*.jade')
  .pipe( plumber() )
  .pipe( jade({ pretty: true }) )
  .pipe( gulp.dest('dist') );

});


/* ==========================================================================
   'gulp css' task
   (1. concatenate .css files
    2. process css with postcss-processors
    3. creates source-map for result css)
   ========================================================================== */

gulp.task('css', function() {

  var processors = [
    precss(),
    autoprefixer({ browsers: ['> 0.15% in RU'] })
  ];

  gulp.src('src/css/style.css')
  .pipe( plumber() )
  .pipe( concatCss('style.css') )
  .pipe( sourcemaps.init() )
  .pipe( postcss(processors) )
  .pipe( sourcemaps.write('.') )
  .pipe( gulp.dest('dist/css') );

});


/* ==========================================================================
   'gulp js' task
   (copies .js files from src to dest folder without changes)
   ========================================================================== */

gulp.task('js', function() {

  gulp.src( paths.js )
  .pipe( gulp.dest('dist/js') )

});


/* ==========================================================================
   'gulp img' task
   (optimize images)
   ========================================================================== */

gulp.task('img', function () {
  return gulp.src( paths.img )
    .pipe( imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe( gulp.dest('dist/img') );
});


/* ==========================================================================
   'gulp img' task
   (builds svg-sprite from a bunch of separate svg-icons)
   ========================================================================== */

gulp.task('icons', function() {

  gulp.src('src/img/icons/*.svg')
  .pipe( svgstore() )
  .pipe( imagemin({ multipass: true }))
  .pipe( gulp.dest('dist/img') );

});


/* ==========================================================================
   'gulp ftp' task
   (upload dist folder to provided ftp address)
   ========================================================================== */

gulp.task('ftp', function() {

  var conn = ftp.create({
    host:     '',
    user:     '',
    password: '',
    parallel: 10
  });

  return gulp.src('dist/**/*' , { buffer: false })
    .pipe( conn.newer('/public_html') )
    .pipe( conn.dest('/public_html') );

});


/* ==========================================================================
   'gulp clean' task
   (delete dist folder)
   ========================================================================== */

gulp.task('clean', function() {

  del('dist/**');

});
