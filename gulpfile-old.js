// Based on markgoodyear.com/2014/01/getting-started-with-gulp/ with additions for BrowserSync


// Project Settings

var domain = "workflow.dev.co.uk";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


// Load plugins


var gulp = require('gulp'),
    sass = require('gulp-sass'),
  //  autoprefixer = require('gulp-autoprefixer'),
  //  minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return gulp.src('./scss/project.scss', { style: 'expanded' })
      .pipe(sass().on('error', sass.logError))
  //  .pipe(autoprefixer('last 2 version'))
      .pipe(gulp.dest('./css'))
  //  .pipe(rename({ suffix: '.min' }))
  //  .pipe(minifycss())
   // .pipe(gulp.dest('css'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    
    // move Jquery to JS folder
    gulp.src('bower_components/Old-IE-Fixes/IE7-8Fixes.js')
    .pipe(gulp.dest('js'))
    .pipe(notify({ message: 'IE7-8 fixed added' }));

    // move Jquery to JS folder
    gulp.src('bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('js'));

    // finally merge, minify, lint and move any JS in the dev folder
    return gulp.src('js/dev/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});



// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb);
});


// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function() {

    browserSync.init({
        proxy: "workflow.dev.co.uk"
    });

    gulp.watch("scss/*.scss", ['styles']);
    gulp.watch("*.html").on('change', browserSync.reload);
});




// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['serve'], function() {



  // Watch .scss files
  gulp.watch('scss/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('img/**/*', ['images']);

});