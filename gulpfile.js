'use strict';

var autoprefixer = require('autoprefixer'),
    gulp         = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    plumber      = require('gulp-plumber'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    svgstore     = require('gulp-svgstore'),
    watch        = require('gulp-watch'),
    gutil        = require('gulp-util'),
    calc         = require('postcss-calc'),
    precss       = require('precss'),
    ftp          = require('vinyl-ftp'),
    rimraf       = require('rimraf'),
    seq          = require('run-sequence'),
    express      = require('express');


/* ==========================================================================
   Variables
   ========================================================================== */

var paths = {
  jade: 'src/**/*.jade',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  icons: 'src/icons/*.svg',
  temp: 'src/temp/*'
};

var postcssProcessors = [
  precss(),
  calc(),
  autoprefixer({ browsers: ['> 0.15% in RU'] })
];

var ftpConnection = ftp.create({
  host:     '',
  user:     '',
  password: '',
  parallel: 10
});

var ftpUploadAddress = '/public_html';

var onError = function(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};


/* ==========================================================================
   Tasks
   ========================================================================== */

gulp.task('default', function(cb) {
  seq('watch', 'server', cb);
});

gulp.task('build', function(cb) {
  seq('clean', ['html', 'css', 'js', 'img', 'icons', 'temp'], cb);
});

gulp.task('watch', ['build'], function() {
  watch( paths.jade,  function() { seq('html');  });
  watch( paths.css,   function() { seq('css');   });
  watch( paths.js,    function() { seq('js');    });
  watch( paths.img,   function() { seq('img');   });
  watch( paths.icons, function() { seq('icons'); });
  watch( paths.temp,  function() { seq('temp');  });
});

gulp.task('clean', function(cb) {
  rimraf('dist', cb);
});

gulp.task('server', function() {
  express().use(express.static('dist')).listen(4000);
});

gulp.task('html', function() {
  return gulp.src( paths.jade )
    .pipe( plumber({ errorHandler: onError }))
    .pipe( jade({ pretty: true }) )
    .pipe( gulp.dest('dist') );
});

gulp.task('css', function() {
  return gulp.src('src/css/style.css')
    .pipe( plumber({ errorHandler: onError }))
    .pipe( sourcemaps.init() )
    .pipe( postcss(postcssProcessors) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('dist/resources/css') );
});

gulp.task('js', function() {
  return gulp.src( paths.js )
    .pipe( gulp.dest('dist/resources/js') )
});

gulp.task('img', function () {
  return gulp.src( paths.img )
    .pipe( imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe( gulp.dest('dist/resources/img') );
});

gulp.task('icons', function() {
  return gulp.src( paths.icons )
    .pipe( svgstore() )
    .pipe( imagemin({ multipass: true }))
    .pipe( gulp.dest('dist/resources/img') );
});

gulp.task('temp', function() {
  return gulp.src( paths.temp )
    .pipe( gulp.dest('dist/temp') )
});

gulp.task('ftp', function() {
  return gulp.src('dist/**/*' , { buffer: false })
    .pipe( ftpConnection.newer( ftpUploadAddress ) )
    .pipe( ftpConnection.dest( ftpUploadAddress ) );
});
