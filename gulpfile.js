"use strict";

const path = require("path");
const gulp = require("gulp");
const del = require('del');
const gulpSequence = require("gulp-sequence");
const plumber = require('gulp-plumber');

const stylus = require("gulp-stylus");
const jeet = require("jeet");
const rupture = require('rupture');

const rev = require('gulp-rev');
const revReplace = require("gulp-rev-replace");

const npmConfig = require(path.resolve(__dirname, 'package.json'));

let config = {
  src: 'src',
  dist: 'dist'
};

let paths = {
  src: {},
  dist: {}
};

gulp.task('clean', function() {
  return del(['dist/**/*']);
});

gulp.task('vendor-assets', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/prismjs/prism.js',
    'node_modules/prismjs/themes/prism.css'

  ])
  .pipe(gulp.dest('dist/stylegen-assets/vendor'));
});

gulp.task('scripts', function() {
  return gulp.src('scripts/**/*')
  .pipe(gulp.dest('dist/stylegen-assets/scripts'));
});

gulp.task('styles', function() {
  return gulp.src('styles/*.styl')
  .pipe(plumber())
  .pipe(stylus({ use: [jeet(), rupture()], compress: false }))
  .pipe(gulp.dest('dist/stylegen-assets/styles'));
});

gulp.task('asset-revisioning', ['styles', 'scripts', 'vendor-assets'], function () {
  return gulp.src('./dist/stylegen-assets/**/*.{css,js}', { base: 'dist/stylegen-assets' })
  .pipe(rev())
  .pipe(gulp.dest('dist/stylegen-assets'))  // write rev'd stylegen-assets to build dir
  .pipe(rev.manifest())
  .pipe(gulp.dest('dist/stylegen-assets')); // write manifest to build dir
});

gulp.task('templates', ['asset-revisioning'], function() {
  let manifest = gulp.src(path.resolve(__dirname, 'dist/stylegen-assets/rev-manifest.json'));

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
