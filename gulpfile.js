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
    rename       = require('gulp-rename'),
    calc         = require('postcss-calc'),
    postcssSVG   = require('postcss-svg'),
    cssImport    = require('postcss-import'),
    precss       = require('precss'),
    ftp          = require('vinyl-ftp'),
    rimraf       = require('rimraf'),
    seq          = require('run-sequence'),
    browserSync  = require('browser-sync').create();


/* ==========================================================================
   Variables
   ========================================================================== */

var paths = {
  jade: 'src/**/*.jade',
  jadePages: 'src/*.jade',
  css: 'src/css/**/*.css',
  fonts: 'src/fonts/*',
  js: 'src/js/**/*.js',
  img: 'src/img/*',
  spriteSvg: 'src/sprite-svg/*.svg',
  temp: 'src/temp/**/*'
};

var postcssProcessors = [
  cssImport({ glob: true }),
  precss(),
  calc(),
  postcssSVG({ paths: ['src/sprite-css'], svgo: true }),
  autoprefixer({ browsers: ['last 2 version'] })
];

var ftpConnection = ftp.create({
  host:     '',
  user:     '',
  password: '',
  parallel: 10
});

var ftpUploadAddress = '';

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
  seq('clean',['html', 'css', 'fonts', 'js', 'img', 'sprite-svg', 'temp'], cb);
});

gulp.task('watch', ['build'], function() {
  watch( paths.jade,      function() { seq('html');       });
  watch( paths.css,       function() { seq('css');        });
  watch( paths.fonts,     function() { seq('fonts');      });
  watch( paths.js,        function() { seq('js');         });
  watch( paths.img,       function() { seq('img');        });
  watch( paths.spriteSvg, function() { seq('sprite-svg'); });
  watch( paths.temp,      function() { seq('temp');       });
});

gulp.task('clean', function(cb) {
  rimraf('dist', cb);
});

gulp.task('server', function() {
  browserSync.init({ server: { baseDir: 'dist' } });
});

gulp.task('html', function() {
  return gulp.src( paths.jadePages )
    .pipe( plumber({ errorHandler: onError }))
    .pipe( jade({ pretty: true }) )
    .pipe( gulp.dest('dist') )
    .pipe( browserSync.stream() );
});

gulp.task('css', function() {
  return gulp.src('src/css/base.css')
    .pipe( plumber({ errorHandler: onError }))
    .pipe( sourcemaps.init() )
    .pipe( postcss(postcssProcessors) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('dist/resources/css') )
    .pipe( browserSync.stream() );
});

gulp.task('fonts', function() {
  return gulp.src( paths.fonts )
    .pipe( gulp.dest('dist/resources/fonts') )
    .pipe( browserSync.stream() );
});

gulp.task('js', function() {
  return gulp.src( paths.js )
    .pipe( gulp.dest('dist/resources/js') )
    .pipe( browserSync.stream() );
});

gulp.task('img', function () {
  return gulp.src( paths.img )
    .pipe( imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe( gulp.dest('dist/resources/img') )
    .pipe( browserSync.stream() );
});

gulp.task('sprite-svg', function() {
  return gulp.src( paths.spriteSvg )
    .pipe( svgstore() )
    .pipe( imagemin({ multipass: true }))
    .pipe( rename('sprite.svg'))
    .pipe( gulp.dest('dist/resources/img') )
    .pipe( browserSync.stream() );
});

gulp.task('temp', function() {
  return gulp.src( paths.temp )
    .pipe( gulp.dest('dist/temp') )
    .pipe( browserSync.stream() );
});

gulp.task('ftp', function() {
  return gulp.src('dist/**/*' , { buffer: false })
    .pipe( ftpConnection.dest( ftpUploadAddress ) );
});
