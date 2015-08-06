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
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var merge2       = require('merge2');
var bowerMain    = require('bower-main');
var bowerMainJavaScriptFiles = bowerMain('js','min.js');


// Proxy Server + watching scss/html files
gulp.task('watch', ['sass'], function() {

    browserSync.init({
    	files: "css/**/*.css",
        proxy: domain
    });    

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);

    gulp.watch('js/dev/*.js', ['scripts']); // watch scripts dev folder and compress/move/etc if changes    
    gulp.watch(['js/*.js']).on('change', browserSync.reload); // reload browser if new js appears
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




// Cutom JS Scripts
gulp.task('scripts', function() {

    // merge, minify, lint and move any JS in the dev folder
    return gulp.src('js/dev/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});



// Build task
gulp.task('build', function() {

    // move and compress Old IE Fixes
    gulp.src('bower_components/Old-IE-Fixes/IE7-8Fixes.js')
    .pipe(notify({ title: 'Adding project dependencies...', message: '' }))
    .pipe(gulp.dest('js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(notify({ title: 'Adding project dependencies...', message: 'IE7-8 fixed added' }));

    // move Jquery to JS folder
    gulp.src('bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('js'))
    .pipe(notify({ title: 'Adding project dependencies...', message: 'jQuery CDN fallback' }));

    return merge2(
        gulp.src(bowerMainJavaScriptFiles.minified),
        gulp.src(bowerMainJavaScriptFiles.minifiedNotFound)
          .pipe(concat('tmp.min.js'))
          .pipe(uglify())        
          .pipe(notify({ title: 'Adding project dependencies...', message: 'Vendor plugins' }))
    )
    .pipe(concat('plugins.min.js'))
    .pipe(gulp.dest('js'));   
});


gulp.task('default', ['watch']);

