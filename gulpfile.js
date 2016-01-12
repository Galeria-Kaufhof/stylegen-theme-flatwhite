"use strict";

var path = require("path");
var gulp = require("gulp");
var clean = require("gulp-clean");
var gulpSequence = require("gulp-sequence");

var plumber = require('gulp-plumber');
var stylus = require("gulp-stylus");
var jeet = require("jeet");

var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");

var npmConfig = require(path.resolve(__dirname, 'package.json'));

gulp.task('clean', function() {
  return gulp.src('dist')
  .pipe(clean());
});

gulp.task('scripts', function() {
  return gulp.src('scripts/**/*')
    .pipe(gulp.dest('dist/stylegen-assets/scripts'));
});

gulp.task('styles', function() {
  return gulp.src('styles/**/[^_]*.styl')
    .pipe(plumber())
    .pipe(stylus({ use: jeet(), compress: false }))
    .pipe(gulp.dest('dist/stylegen-assets/styles'));
});

gulp.task('asset-revisioning', ['styles', 'scripts'], function () {
  return gulp.src('./dist/stylegen-assets/**/*.{css,js}', { base: 'dist/stylegen-assets' })
    .pipe(rev())
    .pipe(gulp.dest('dist/stylegen-assets'))  // write rev'd stylegen-assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/stylegen-assets')); // write manifest to build dir
});

gulp.task('templates', ['asset-revisioning'], function() {
  var manifest = gulp.src(path.resolve(__dirname, 'dist/stylegen-assets/rev-manifest.json'));

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
  gulp.watch(['styles/**/*.styl', 'scripts/**/*', 'templates/**/*.hbs'], ['build']);
});
