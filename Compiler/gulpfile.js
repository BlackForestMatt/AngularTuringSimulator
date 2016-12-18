var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var tslint = require('gulp-tslint');
var jasmine = require('gulp-jasmine');
var uglify = require('gulp-uglify');

gulp.task('test-simulator', ['build-simulator'], function () {
  gulp.src('spec/core/**/*.js').pipe(jasmine({
    verbose: true
  }));
});

gulp.task('lint', ['clean'], function () {
  gulp.src('src/core/**/*.ts').pipe(tslint({
    formatter: 'verbose'
  })).pipe(tslint.report())
});

gulp.task('build-simulator', ['clean', 'lint'], function () {
  return gulp.src('src/core/**/*.ts')
  .pipe(ts({
    target: "ES5",
    module: "commonjs",
    removeComments: true,
    out: "turing.js"
  }))
  .pipe(uglify({
    mangle: true,
    compress: true
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('copy', ['clean'], function () {
  return gulp.src([
    'src/example/tryit.html',
    'src/example/tryit.js'
  ])
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('test', ['build', 'test-simulator']);

gulp.task('build', ['clean', 'lint', 'build-simulator']);

gulp.task('default', ['build', 'copy', 'test']);
