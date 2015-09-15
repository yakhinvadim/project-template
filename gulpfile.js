'use strict';

var gulp         = require('gulp'),
    watch        = require('gulp-watch'),
    plumber      = require('gulp-plumber'),
    jade         = require('gulp-jade'),
    imagemin     = require('gulp-imagemin'),
    svgstore     = require('gulp-svgstore'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    precss       = require('precss'),
    autoprefixer = require('autoprefixer'),
    path         = require('path'),
    del          = require('del'),
    concatCss    = require('gulp-concat-css'),
    ftp          = require('vinyl-ftp');

var paths = {
  jade: 'src/**/*.jade',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  icons: 'src/icons/*'
};


// default

gulp.task('default', function() {
});


// process css with postcss

gulp.task( 'css', function() {

  var processors = [
    precss(),
    autoprefixer({ browsers: ['> 0.15% in RU'] })
  ];

  gulp.src( 'src/css/style.css' )
  .pipe(plumber())
  .pipe(concatCss('style.css'))
  .pipe(sourcemaps.init())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.'))
  .pipe( gulp.dest('dest/css') );

});


// build svg sprite from svg-icons

gulp.task('icons', function() {

  gulp.src('src/img/icons/*.svg')
  .pipe(svgstore())
  .pipe(imagemin({
    multipass: true
  }))
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

  watch(paths.jade,  function() { gulp.start('html');  });
  watch(paths.css,   function() { gulp.start('css');   });
  watch(paths.img,   function() { gulp.start('img');   });
  watch(paths.icons, function() { gulp.start('icons'); });

});


// clean

gulp.task('clean', function() {

  del('dest/**');

});


// build

gulp.task('build', function() {

  gulp.start(['html', 'css', 'js', 'img', 'icons']);

});


// process images

gulp.task('img', function () {
  return gulp.src(paths.img)
    .pipe(imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('dest/img'));
});


// js

gulp.task('js', function() {
  gulp.src(paths.js)
  .pipe(gulp.dest('dest/js'))
});


// ftp

gulp.task('ftp', function() {

  var conn = ftp.create({
    host:     '',
    user:     '',
    password: '',
    parallel: 10
  });

  return gulp.src( 'dest/**/*' , { buffer: false } )
    .pipe( conn.newer( '/public_html' ) )
    .pipe( conn.dest( '/public_html' ) );

});
