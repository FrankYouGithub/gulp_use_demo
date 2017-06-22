var gulp = require('gulp')
var minicss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	clean = require('gulp-clean'),
	scp = require('gulp-scp2'),
	fs = require('fs'),
	browserSync = require('browser-sync').create();

gulp.task('reload',function(){
	browserSync.reload();
})
gulp.task('server',function(){
	browserSync.init({
		server: {
			baseDir: './'
		}
	})
	gulp.watch(['**/*.css','**/*.js','**/*.html'],['reload'])
})
gulp.task('scp', function() {
        return gulp.src('src/**/*')
            .pipe(scp({
                host: '121.40.201.213',
                username: 'root',
                privateKey: fs.readFileSync('/Users/wingo/.ssh/id_rsa'),
                dest: '/var/www/fe.jirengu.com',
                watch: function(client) {
                    client.on('write', function(o) {
                        console.log('write %s', o.destination);
                    });
                }
            }))
            .on('error', function(err) {
                console.log(err);
            });
    });
gulp.task('css',function(argument){
	gulp.src('css/*.css').pipe(concat('merge.css')).pipe(minicss())
	.pipe(rename({
		suffix: '.min'
	})).pipe(minicss()).pipe(gulp.dest('dist/css/'))
})

gulp.task('js',function(argument){
	gulp.src('js/*.js').pipe(concat('merge.js')).pipe(rename({
		suffix: '.min'
	})).pipe(uglify()).pipe(gulp.dest('dist/js/'))
})

gulp.task('clear',function(){
	gulp.src('dist/*',{read: false}).pipe(clean())	
})
gulp.task('img',function(){
	gulp.src('img/*').pipe(imagemin()).pipe(gulp.dest('dist/imgs'))
})
gulp.task('build',['css','js'])