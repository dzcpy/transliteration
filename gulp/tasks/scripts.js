'use strict';
var gulp       = require('gulp'),
    browserify = require('gulp-browserify'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    config     = require('../../package.json');

gulp.task('js:compile', function() {
	gulp.src('src/*')
        .pipe(uglify())
		.pipe(gulp.dest('./build/'))
        .pipe(browserify())
        .pipe(rename(config.name + '.min.js'))
		.pipe(gulp.dest('./build/'));
});

gulp.task('js', ['js:compile']);
