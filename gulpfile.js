var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat		= require('gulp-concat'),
	uglify		= require('gulp-uglifyjs'),
	cssnano		= require('gulp-cssnano'),
	rename		= require('gulp-rename'),
	del			= require('del'),
	imagemin	= require('gulp-imagemin'),
	pngquant	= require('imagemin-pngquant'),
	cache		= require('gulp-cache'),
	autoprefixer= require('gulp-autoprefixer'),
	iconfont 	= require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
    iconfontCss = require('gulp-iconfont-css'),
    runTimestamp = Math.round(Date.now() / 1000),
    fontName  	= 'icons';

gulp.task('sass', function() {
	// return gulp.src(['app/sass/**/*.+(sass|scss)', '!app/sass/libs.sass'])
		return gulp.src(['app/sass/libs.sass', 'app/sass/main.sass'])
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
gulp.task('sass-libs', function() {
	return gulp.src('app/sass/libs.sass')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(concat('libs.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});
// gulp.task('css-libs', ['sass'], function() {
// 	return gulp.src(['!app/css/*.min*', 'app/css/*.css'])
// 	.pipe(cssnano())
// 	.pipe(rename({suffix: '.min'}))
// 	.pipe(gulp.dest('app/css'));
// });

gulp.task('iconfont', function(){
	return gulp.src(['app/icons/*.svg'])
		.pipe(iconfontCss({
			fontName: fontName,
			normalize: true,
			fontHeight: 1024,
			path: 'app/css/templates/_icons.scss',
			targetPath: '../../css/_icons.scss',
			fontPath: '../../fonts/icons/'
		 }))
		.pipe(iconfont({
			fontName: fontName
		}))
		.pipe(gulp.dest('app/fonts/icons'));
		
});



gulp.task('scripts', function() {
	return gulp.src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/bootstrap/dist/js/bootstrap.min.js'
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'	
		},
		notify: false

	});
});

gulp.task('watch', ['browser-sync', 'sass', 'sass-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.+(sass|scss)', ['sass'])
	gulp.watch('app/*.html', browserSync.reload)
	gulp.watch('app/js/**/*.js', browserSync.reload)
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
	var buildCss = gulp.src([
		'app/css/style.css',
		'app/css/libs.css'
		])
	.pipe(gulp.dest('dist/css'))
	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))
	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));	
});

gulp.task('default', ['watch']);
