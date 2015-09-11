'use strict';

var gulp         = require('gulp'),
    watch        = require('gulp-watch'),
    plumber      = require('gulp-plumber'),
    jade         = require('gulp-jade'),
    svgstore     = require('gulp-svgstore'),
    svgmin       = require('gulp-svgmin'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    precss       = require('precss'),
    autoprefixer = require('autoprefixer'),
    path         = require('path'),
    del          = require('del');

var paths = {
  jade: 'src/*.jade',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  icons: 'src/img/icons/*.svg'
};


// default

gulp.task('default', function() {
});


// process css with postcss

gulp.task( 'css', function() {

  var processors = [
    autoprefixer({ browsers: ['> 0.15% in RU'] }),
    precss()
  ];

  gulp.src( 'src/css/*.css' )
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.'))
  .pipe( gulp.dest('dest/css') );

});


// build svg sprite from svg-icons

gulp.task('icons', function() {

  gulp.src('src/img/icons/*.svg')
  .pipe(svgmin(function(file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    };
  }))
  .pipe(svgstore())
  .pipe(gulp.dest('dest/img'));

});


// compile .jade to .html

gulp.task('html', function() {

  gulp.src('src/*.jade')
  .pipe(plumber())
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest('dest'));

});


// watch for changes

gulp.task('watch', function() {

  watch(paths.css,   function() { gulp.start('css');   });
  watch(paths.jade,  function() { gulp.start('html');  });
  watch(paths.icons, function() { gulp.start('icons'); });

});


// clean

gulp.task('clean', function() {

  del('dest/**');

});
