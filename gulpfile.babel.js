import browserify from 'browserify';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import babelify from 'babelify';
import del from 'del';

const paths = {
  sourceBrowser: 'lib/browser.js',
  sourceNode: ['lib/*.js', '!lib/browser.js', '!lib/data.js'],
  destBrowser: 'build/browser/',
  destNode: 'build/node/',
};

gulp.task('default', ['build:browser', 'build:node']);

gulp.task('build:browser', ['clean:browser'], () =>
  browserify(paths.sourceBrowser, { debug: true })
    .transform(babelify, { sourceMaps: true })
    .bundle()
    .pipe(source('transliteration.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulp.dest(paths.destBrowser))
    .pipe(rename('transliteration.min.js'))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destBrowser))
    .pipe(gutil.noop())
);

gulp.task('build:node', ['clean:node'], () =>
  gulp.src(paths.sourceNode)
    .pipe(babel())
    .pipe(gulp.dest(paths.destNode))
);

gulp.task('clean:browser', () => del('build/browser/*'));

gulp.task('clean:node', () => del('build/node/*'));
