var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');

var SOURCEPATHS = {
	sassSource: 'src/scss/*.scss',
	htmlSource: 'src/*.html'
}

var APPPATH = {
	root: 'app/',
	css: 'app/css',
	js: 'app/js'
}

gulp.task('sass', function() {
	return gulp.src(SOURCEPATHS.sassSource)
	  // .pipe(autoprefixer())
	  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	  .pipe(autoprefixer())
	  // best practice to add autoprefixer pipe imediatelly after sass in order not to throw error in case of using js comments in sass files
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
gulp.task('copy', function() {
	gulp.src(SOURCEPATHS.htmlSource)
		.pipe(gulp.dest(APPPATH.root))
});


gulp.task('watch',['sass', 'serve', 'copy'], function() {
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});
gulp.task('default', ['watch']);