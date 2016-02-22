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
        styles: path.resolve(__dirname, config.dist, 'stylegen-assets', 'styles')
      }
    }
  }

  paths.src.jquery = path.resolve(paths.src.nodeModules, 'jquery/dist/jquery.js')

  paths.src.prism = {
    js: path.resolve(paths.src.nodeModules, 'prismjs/prism.js'),
    css: path.resolve(paths.src.nodeModules, 'prismjs/themes/prism.css')
  }

  return paths
}
