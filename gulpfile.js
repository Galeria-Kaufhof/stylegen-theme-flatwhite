"use strict";

var path = require("path");
var gulp = require("gulp");
var clean = require("gulp-clean");
var gulpSequence = require("gulp-sequence");

var plumber = require('gulp-plumber');
var stylus = require("gulp-stylus");

var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");

var npmConfig = require(path.resolve(__dirname, 'package.json'));

gulp.task('clean', function() {
  return gulp.src('dist')
  .pipe(clean());
});

gulp.task('styles', function() {
  return gulp.src('styles/**/[^_]*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('dist/styleguide-assets/styles'));
});

gulp.task('asset-revisioning', ['styles'], function () {
  return gulp.src('./dist/styleguide-assets/**/*.{css,js}', { base: 'dist/styleguide-assets' })
    .pipe(rev())
    .pipe(gulp.dest('dist/styleguide-assets'))  // write rev'd styleguide-assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/styleguide-assets')); // write manifest to build dir
});

gulp.task('templates', ['asset-revisioning'], function() {
  var manifest = gulp.src(path.resolve(__dirname, 'dist/styleguide-assets/rev-manifest.json'));

  return gulp.src('templates/**/[^_]*.hbs')
    .pipe(plumber())
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function(cb) {
	gulpSequence('clean', 'templates')(cb);
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function() {
  gulp.watch(['styles/**/*.styl', 'templates/**/*.hbs'], ['build']);
});
