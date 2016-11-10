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
import es3ify from 'gulp-es3ify';
import rimraf from 'rimraf';

const paths = {
  sourceBrowser: 'src/main/browser.js',
  sourceNode: ['src/main/*.js', '!src/main/browser.js', '!src/main/data.js'],
  sourceBin: 'src/bin/*.js',
  destBrowser: 'lib/browser/',
  destNode: 'lib/node/',
  destBin: 'lib/bin/',
};

gulp.task('default', ['build:browser', 'build:node', 'build:bin']);

gulp.task('build:browser', ['clean:browser'], () =>
  browserify(paths.sourceBrowser, { debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source('transliteration.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(es3ify())
      .pipe(gulp.dest(paths.destBrowser))
      .pipe(rename('transliteration.min.js'))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destBrowser))
    .pipe(gutil.noop()),
);

gulp.task('build:node', ['clean:node'], () =>
  gulp.src(paths.sourceNode)
    .pipe(babel())
    .pipe(gulp.dest(paths.destNode)),
);

gulp.task('build:bin', ['clean:bin'], () =>
  gulp.src(paths.sourceBin)
    .pipe(babel())
    .pipe(rename({ extname: '' }))
    .pipe(gulp.dest(paths.destBin)),
);

gulp.task('clean:browser', cb => rimraf('lib/browser/*', cb));

gulp.task('clean:node', cb => rimraf('lib/node/*', cb));

gulp.task('clean:bin', cb => rimraf('lib/bin/*', cb));
