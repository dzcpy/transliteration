var gulp        = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('build', function (cb) {
    runSequence('js', cb);
});

require('./gulp');
