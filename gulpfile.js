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

const config = {
  src: 'src',
  dist: 'dist'
};

let paths = {
  src: {
    nodeModules: path.resolve(__dirname, 'node_modules'),
    scripts: path.resolve(__dirname, 'src', 'scripts'),
    styles: path.resolve(__dirname, 'src', 'styles'),
    templates: path.resolve(__dirname, 'src', 'templates')
  },
  build: {
    dist: path.resolve(__dirname, config.dist),
    assets: {
      root: path.resolve(__dirname, config.dist, 'stylegen-assets'),
      vendor: path.resolve(__dirname, config.dist, 'stylegen-assets', 'vendor'),
      scripts: path.resolve(__dirname, config.dist, 'stylegen-assets', 'scripts'),
      styles: path.resolve(__dirname, config.dist, 'stylegen-assets', 'styles')
    }
  }
};

paths.src.jquery = path.resolve(paths.src.nodeModules, 'jquery/dist/jquery.js')

paths.src.prism = {
  js: path.resolve(paths.src.nodeModules, 'prismjs/prism.js'),
  css: path.resolve(paths.src.nodeModules, 'prismjs/themes/prism.css')
}

gulp.task('clean', function() {
  return del(paths.dist);
});

gulp.task('jquery', function() {
  return gulp.src(paths.src.jquery)
  .pipe(gulp.dest(paths.build.assets.vendor));
});

gulp.task('prism', function() {
  return gulp.src([paths.src.prism.js, paths.src.prism.css])
  .pipe(gulp.dest(paths.build.assets.vendor));
});

gulp.task('vendor-assets', ['jquery', 'prism']);

gulp.task('scripts', function() {
  return gulp.src(path.resolve(paths.src.scripts, '**/*'))
  .pipe(gulp.dest(paths.build.assets.scripts));
});

gulp.task('styles', function() {
  return gulp.src(`${paths.src.scripts}/*.styl`)
  .pipe(plumber())
  .pipe(stylus({ use: [jeet(), rupture()], compress: false }))
  .pipe(gulp.dest(paths.build.assets.styles));
});

gulp.task('asset-revisioning', ['styles', 'scripts', 'vendor-assets'], function () {
  return gulp.src(path.resolve(paths.build.assets.root, '**/*.{css,js}'), { base: paths.build.assets.root })
  .pipe(rev())
  .pipe(gulp.dest(paths.build.assets.root))  // write rev'd stylegen-assets to build dir
  .pipe(rev.manifest())
  .pipe(gulp.dest(paths.build.assets.root)); // write manifest to build dir
});

gulp.task('templates', ['asset-revisioning'], function() {
  let manifest = gulp.src(path.resolve(__dirname, path.resolve(paths.build.assets.root, 'rev-manifest.json')));

  return gulp.src(path.resolve(paths.src.templates, '**/[^_]*.hbs'))
  .pipe(plumber())
  .pipe(revReplace({manifest: manifest}))
  .pipe(gulp.dest(paths.build.dist));
});

gulp.task('build', function(cb) {
	gulpSequence('clean', 'templates')(cb);
});

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function() {
  gulp.watch([
    path.resolve(paths.src.styles, '**/*.styl'),
    path.resolve(paths.src.scripts, '**/*'),
    path.resolve(paths.src.templates, '**/*.hbs')
  ], ['build']);
});
