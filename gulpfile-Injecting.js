// Based on markgoodyear.com/2014/01/getting-started-with-gulp/ with additions for BrowserSync


// Project Settings

var domain = "workflow.dev.co.uk";


var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss    = require('gulp-minify-css');
var rename 		 = require('gulp-rename');
var notify       = require('gulp-notify');



// Proxy Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
    	files: "css/**/*.css",
        proxy: domain
    });    

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/project.scss")
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest("css"))
        .pipe(rename({ suffix: '.min' }))
  		.pipe(minifycss())
		.pipe(gulp.dest("css"))
        .pipe(browserSync.stream())		
        .pipe(notify({ message: 'SASS task complete' }));
        
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





gulp.task('default', ['serve']);