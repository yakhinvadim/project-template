'use strict';

var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    precss       = require('precss'),
    autoprefixer = require('autoprefixer');


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
