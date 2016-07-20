var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('build', ['clean'], function () {
  return gulp.src([
    'src/**/*.ts'
  ]).pipe(ts({
    module: 'commonjs'
  })).js.pipe(gulp.dest('./dist/turing'));
})
