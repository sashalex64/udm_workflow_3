var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

//====   PATHS

var SOURCEPATHS = {
	sassSource: 'src/scss/*.scss',
	htmlSource: 'src/*.html',
	jsSource: 'src/js/*.js'
}

var APPPATH = {
	root: 'app/',
	css: 'app/css',
	js: 'app/js'
}

//=== T A S K S

//== HTML tasks

gulp.task('clean-html', function() {
	return gulp.src(APPPATH.root + '/*.html', {
		read: false, //reading content
		force: true // remove obsolete file
	})
		.pipe(clean())
});
//defining 'clean-html'
//calling  'clean-html' task in 'copy' task
gulp.task('copy', ['clean-html'], function() {
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPPATH.root))
});
//bundling copy and clean tasks in one task make them work seamlessly

// ===end of HTML tasks

// === JS tasks 
gulp.task('clean-scripts', function() {
	return gulp.src(APPPATH.js + '/*.js', {
		read: false,
		force: true
	})
		.pipe(clean())
});
gulp.task('scripts',['clean-scripts'], function(){
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(APPPATH.js))
});


// == end of JS tasks
gulp.task('sass', function() {
	return gulp.src(SOURCEPATHS.sassSource)
	  // .pipe(autoprefixer())
	  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	  .pipe(autoprefixer())
	  // best practice to add autoprefixer pipe immediately after sass in order not to throw error in case of using js comments in sass files
	  .pipe(gulp.dest(APPPATH.css))
});
gulp.task('serve', ['sass'], function(){
	browserSync.init(
		[APPPATH.css + '/*.css', 
		 APPPATH.root + '/*html',
		 APPPATH.js + '/*.js'], {
		server: {
			baseDir: APPPATH.root
		},
		open: false
	});
});



gulp.task('watch',['sass', 'serve', 'copy','clean-html', 'scripts', 'clean-scripts'], function() {
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
	gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

gulp.task('default', ['watch']);