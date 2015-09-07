'use strict';

var gulp    = require('gulp'),
    postcss = require('gulp-postcss');


// default
gulp.task('default', function() {
});


// postcss

gulp.task( 'css', function() {

  var processors = [
  ];

  return gulp.src( 'src/css/*.css' )
    .pipe( postcss( processors ))
    .pipe( gulp.dest('dest/css') );

});
