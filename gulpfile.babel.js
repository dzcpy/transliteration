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
import rimraf from 'rimraf';

const paths = {
  sourceBrowser: 'lib/src/browser.js',
  sourceNode: ['lib/src/*.js', '!lib/src/browser.js', '!lib/src/data.js'],
  sourceBin: 'lib/bin/*.js',
  destBrowser: 'build/browser/',
  destNode: 'build/node/',
  destBin: 'build/bin',
};

gulp.task('default', ['build:browser', 'build:node', 'build:bin']);

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

gulp.task('build:bin', ['clean:bin'], () =>
  gulp.src(paths.sourceBin)
    .pipe(babel())
    .pipe(rename({ extname: '' }))
    .pipe(gulp.dest(paths.destBin))
);

gulp.task('clean:browser', cb => rimraf('build/browser/*', cb));

gulp.task('clean:node', cb => rimraf('build/node/*', cb));

gulp.task('clean:bin', cb => rimraf('build/bin/*', cb));
