var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tslint = require('gulp-tslint');
var jasmine = require('gulp-jasmine');

gulp.task('test-simulator', ['build-simulator'], function () {
  gulp.src([
    'spec/simulator/**/*.js'
  ]).pipe(jasmine({
    verbose: true
  }));
});

gulp.task('lint', function () {
  gulp.src([
    'src/simulator/**/*.ts'
  ]).pipe(tslint({
    formatter: 'verbose'
  })).pipe(tslint.report())
});

gulp.task('build-simulator', ['clean', 'lint'], function () {
  return gulp.src([
    'src/simulator/**/*.ts'
  ]).pipe(ts({
    module: 'commonjs'
  })).js.pipe(gulp.dest('./dist/simulator'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('test', ['build', 'test-simulator']);

gulp.task('build', ['clean', 'lint', 'build-simulator']);

gulp.task('default', ['build', 'test']);
