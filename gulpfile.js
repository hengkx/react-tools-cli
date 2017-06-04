const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');

gulp.task('clean', function (cb) {
  return del(['./lib'], cb);
});

function scripts() {
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .on('error', function (err) {
      console.log(err.message);
      this.end();
    })
    .pipe(gulp.dest('lib'));
}

gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);


gulp.task('watch', function () {
  gulp.watch('./src/**/*.js', ['scripts-watch']);
});

gulp.task('default', ['watch', 'scripts']);
