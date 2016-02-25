"use strict"

const path = require('path')

module.exports = function(config) {
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
        fonts: path.resolve(__dirname, config.dist, 'stylegen-assets', 'fonts'),
        styles: path.resolve(__dirname, config.dist, 'stylegen-assets', 'styles')
      }
    }
  }

  paths.src.jquery = path.resolve(paths.src.nodeModules, 'jquery/dist/jquery.js')
  paths.src.hammerjs = path.resolve(paths.src.nodeModules, 'hammerjs/hammer.js')

  paths.src.prism = {
    js: path.resolve(paths.src.nodeModules, 'prismjs/prism.js'),
    css: path.resolve(paths.src.nodeModules, 'prismjs/themes/prism.css')
  }

  paths.src.ionicons = {
    css: path.resolve(paths.src.nodeModules, 'ionicons/css/ionicons.min.css'),
    fonts: path.resolve(paths.src.nodeModules, 'ionicons/fonts')
  }

  paths.src.lato = {
    css: path.resolve(paths.src.nodeModules, 'lato-font/css/lato-font.min.css'),
    fonts: path.resolve(paths.src.nodeModules, 'lato-font/fonts')
  }

  return paths
}
