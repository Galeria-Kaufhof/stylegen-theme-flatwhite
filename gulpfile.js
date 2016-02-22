"use strict"

const path = require("path")
const gulp = require("gulp")
const del = require('del')
const gulpSequence = require("gulp-sequence")
const plumber = require('gulp-plumber')

const stylus = require("gulp-stylus")
const jeet = require("jeet")
const rupture = require('rupture')

const rev = require('gulp-rev')
const revReplace = require("gulp-rev-replace")

const npmConfig = require(path.resolve(__dirname, 'package.json'))

const config = {
  src: 'src',
  dist: 'dist'
}

const paths = require('./path-config')(config)

gulp.task('clean', function() {
  return del(paths.build.dist)
})

gulp.task('jquery', function() {
  return gulp.src(paths.src.jquery)
  .pipe(gulp.dest(paths.build.assets.vendor))
})

gulp.task('prism', function() {
  return gulp.src([paths.src.prism.js, paths.src.prism.css])
  .pipe(gulp.dest(paths.build.assets.vendor))
})

gulp.task('ionicons-fonts', function() {
  return gulp.src([path.resolve(paths.src.ionicons.fonts, '**/*')], { base: path.resolve(paths.src.ionicons.fonts) })
  .pipe(gulp.dest(paths.build.assets.fonts))
})

gulp.task('ionicons-styles', function() {
  return gulp.src([paths.src.ionicons.css])
  .pipe(gulp.dest(paths.build.assets.vendor))
})

gulp.task('ionicons', ['ionicons-fonts', 'ionicons-styles'])

gulp.task('lato-fonts', function() {
  return gulp.src([path.resolve(paths.src.lato.fonts, '**/*')], { base: path.resolve(paths.src.lato.fonts) })
  .pipe(gulp.dest(paths.build.assets.fonts))
})

gulp.task('lato-styles', function() {
  return gulp.src([paths.src.lato.css])
  .pipe(gulp.dest(paths.build.assets.vendor))
})

gulp.task('lato', ['lato-fonts', 'lato-styles'])

gulp.task('vendor-assets', ['jquery', 'prism', 'ionicons', 'lato'])

gulp.task('scripts', function() {
  return gulp.src(path.resolve(paths.src.scripts, '**/*'))
  .pipe(gulp.dest(paths.build.assets.scripts))
})

gulp.task('styles', function() {
  return gulp.src(`${paths.src.styles}/*.styl`)
  .pipe(plumber())
  .pipe(stylus({ use: [jeet(), rupture()], compress: false }))
  .pipe(gulp.dest(paths.build.assets.styles))
})

gulp.task('asset-revisioning', ['styles', 'scripts', 'vendor-assets'], function () {
  return gulp.src(path.resolve(paths.build.assets.root, '**/*.{css,js}'), { base: paths.build.assets.root })
  .pipe(rev())
  .pipe(gulp.dest(paths.build.assets.root))  // write rev'd stylegen-assets to build dir
  .pipe(rev.manifest())
  .pipe(gulp.dest(paths.build.assets.root)) // write manifest to build dir
})

gulp.task('templates', ['asset-revisioning'], function() {
  let manifest = gulp.src(path.resolve(__dirname, path.resolve(paths.build.assets.root, 'rev-manifest.json')))

  return gulp.src(path.resolve(paths.src.templates, '**/[^_]*.hbs'))
  .pipe(plumber())
  .pipe(revReplace({manifest: manifest}))
  .pipe(gulp.dest(paths.build.dist))
})

gulp.task('build', function(cb) {
	gulpSequence('clean', 'templates')(cb)
})

gulp.task('default', ['build'])

gulp.task('watch', ['build'], function() {
  gulp.watch([
    path.resolve(paths.src.styles, '**/*.styl'),
    path.resolve(paths.src.scripts, '**/*'),
    path.resolve(paths.src.templates, '**/*.hbs')
  ], ['build'])
})
