'use strict';

var gulp         = require('gulp'),
    svgstore     = require('gulp-svgstore'),
    svgmin       = require('gulp-svgmin'),
    postcss      = require('gulp-postcss'),
    precss       = require('precss'),
    autoprefixer = require('autoprefixer'),
    path         = require('path');


// default
gulp.task('default', function() {
});


// postcss

gulp.task( 'css', function() {

  var processors = [
    autoprefixer({ browsers: ['> 0.15% in RU'] }),
    precss()
  ];

  return gulp.src( 'src/css/*.css' )
    .pipe( postcss( processors ))
    .pipe( gulp.dest('dest/css') );

});


// svg

gulp.task('icons', function() {

  return gulp
    .src('src/img/icons/*.svg')
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
