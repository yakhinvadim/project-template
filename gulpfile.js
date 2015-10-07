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
    calc         = require('postcss-calc'),
    precss       = require('precss'),
    ftp          = require('vinyl-ftp'),
    rimraf       = require('rimraf'),
    seq          = require('run-sequence'),
    express      = require('express');

/* ==========================================================================
   variables
   ========================================================================== */

var paths = {
  jade: 'src/**/*.jade',
  css: 'src/css/**/*.css',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  icons: 'src/icons/*.svg'
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


/* ==========================================================================
   'gulp' task
   (do nothing)
   ========================================================================== */

gulp.task('default', function(cb) {
  seq('watch', 'express', cb);
});


/* ==========================================================================
   'gulp build' task
   (build 'dist' folder from 'src' folder)
   ========================================================================== */

gulp.task('build', function(cb) {
  seq('clean', ['html', 'css', 'js', 'img', 'icons'], cb);
});


/* ==========================================================================
   'gulp watch' task
   (watch for changes in source folders and automatically run tasks
   to process these changes)
   ========================================================================== */

gulp.task('watch', ['build'], function() {
  watch( paths.jade,  function() { seq('html');  });
  watch( paths.css,   function() { seq('css');   });
  watch( paths.js,    function() { seq('js');    });
  watch( paths.img,   function() { seq('img');   });
  watch( paths.icons, function() { seq('icons'); });
});


/* ==========================================================================
   'gulp html' task
   (compile .jade files to .html files)
   ========================================================================== */

gulp.task('html', function() {
  return gulp.src( paths.jade )
    .pipe( plumber() )
    .pipe( jade({ pretty: true }) )
    .pipe( gulp.dest('dist') );
});


/* ==========================================================================
   'gulp css' task
   (concatenate .css files, process css with postcss-processors,
    create source-map for result css)
   ========================================================================== */

gulp.task('css', function() {
  return gulp.src('src/css/style.css')
    .pipe( plumber() )
    .pipe( sourcemaps.init() )
    .pipe( postcss(postcssProcessors) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('dist/resources/css') );
});


/* ==========================================================================
   'gulp js' task
   (copy .js files from src to dest folder without changes)
   ========================================================================== */

gulp.task('js', function() {
  return gulp.src( paths.js )
    .pipe( gulp.dest('dist/resources/js') )
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
    .pipe( gulp.dest('dist/resources/img') );
});


/* ==========================================================================
   'gulp icons' task
   (build svg-sprite from separate svg-icons)
   ========================================================================== */

gulp.task('icons', function() {
  return gulp.src( paths.icons )
    .pipe( svgstore() )
    .pipe( imagemin({ multipass: true }))
    .pipe( gulp.dest('dist/resources/img') );
});


/* ==========================================================================
   'gulp ftp' task
   (upload dist folder to ftp)
   ========================================================================== */

gulp.task('ftp', function() {
  return gulp.src('dist/**/*' , { buffer: false })
    .pipe( ftpConnection.newer( ftpUploadAddress ) )
    .pipe( ftpConnection.dest( ftpUploadAddress ) );
});


/* ==========================================================================
   'gulp clean' task
   (delete dist folder)
   ========================================================================== */

gulp.task('clean', function(cb) {
  rimraf('dist', cb);
});

/* ==========================================================================
   'gulp server' task
   (run localhost:4000)
   ========================================================================== */

gulp.task('express', function() {
  express().use(express.static('dist')).listen(4000);
});
