const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');

gulp.task('clean', function () {
  return del(['./lib']);
});

gulp.task('js', function () {
  gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'react', 'stage-0'],
      plugins: ['add-module-exports', 'transform-runtime']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['clean'], function () {
  gulp.watch('./src/**/*.js', ['js']);
});
