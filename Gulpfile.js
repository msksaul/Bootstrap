'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let browserSync = require('browser-sync');
let del = require('del');
let imagemin = require('gulp-imagemin');
let uglify = require('gulp-uglify');
let usemin = require('gulp-usemin');
let rev = require('gulp-rev');
let cleanCss = require('gulp-flatmap');
let htmlmin = require('gulp-htmlmin');
let flatmap = require('gulp-flatmap')

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

gulp.task('clean', () => {
  return del(['dist']);
});

gulp,task('copyfonts', () => {
  gulp.src('./node_modules/font-awesome/fonts/++/*.{ttf,woff,eof,svg}*')
  .pipe(gulp.dest('./dist/fonts'));
})

gulp.task('imagemin', () => {
  return gulp.src('img/*.{png,jpg,gif}')
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true,}))
  .pipe(gulp.dest('dist/img'))
})


gulp.task('usemin', () => {
  return gulp.src('./*.html')
  .pipe(flatmap(function(stream, file){
      return stream
        .pipe(usemin({
            css: [ rev() ],
            html: [ () => { return htmlmin({ collapseWhitespace: true })} ],
            js: [ uglify(), rev() ],
            inlinejs: [ uglify() ],
            inlinecss: [ cleanCss(), 'concat' ]
        }))
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build',gulp.series('clean'), () => {
    gulp.parallel('copyfonts','imagemin','usemin');
});
