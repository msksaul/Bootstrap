'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');


sass.compiler = require('node-sass')

gulp.task('sass', () => {
  return gulp.src('./css/*.scss')
  .pipe(sass().on('error',sass.logError))
  .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./css/*.scss', gulp.series('sass'));
});

gulp.task('browser-sync', () => {
  let files = [
    './*.html',
    './css/*.css',
    './js/*.js',
    './img/*.{png,jpg,gif}'
  ];
  browserSync.init(files, {
    server: {
      baseDir: './'
    }
  });
});

gulp.task('default', gulp.series('browser-sync'), () => {
  gulp.parallel('sass:watch')
});

