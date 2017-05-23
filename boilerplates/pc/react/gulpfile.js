const gulp = require('gulp');
const del = require('del');
const vinylPaths = require('vinyl-paths');

gulp.task('clean:images', function () {
    return gulp.src(
        [
            './images/**/*',
        ], {
            base: './'
        }
    )
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('app/resources/'));
});

gulp.task('clean:app', function () {
    return del(
        [
            'app/**/*',
            '!app/web.config',
            '!app/app.js',
            '!app/package.json',
            '!app/node_modules/**/*',
            '!app/update/**',
            '!app/update/*',
        ]
    );
});

gulp.task('clean', ['clean:images', 'clean:app']);
