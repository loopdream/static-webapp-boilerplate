const gulp = require('gulp');

/* Create a global object of gulp + node plugins */
const $ = Object.assign({
  bs:     require('browser-sync').create(),
  rs:     require('run-sequence'),
  argv:   require('yargs').argv,
  fs:     require('fs'),
  yaml:   require('js-yaml'),
  _:      require('lodash'),
  oMerge: require('object-merge')
}, require('gulp-load-plugins')());

require('es6-promise').polyfill();

const config = {
  defaultPort: 3000,
  environment: $.argv.environment || 'local',
  minify: $.argv.minify || false,
  paths: {
    src: './src',
    dist: './dist', 
    data: './src/data',
    templates: './src/templates/pages',
    srcImages: './src/assets/images',
    srcStyles: './src/assets/styles',
    srcScripts: './src/assets/scripts',
    distImages: './dist/assets/images',
    distStyles: './dist/assets/styles',
    distScripts: './dist/assets/scripts'
  }
}

function getTask(task) {
  return require('./gulp/tasks/' + task)(gulp, config, $);
}

const tasks = [
  'clean',
  'styles',
  'scripts',
  'templates',
  'images',
  'watch'
];

$._.each(tasks, (task, i) => {
  gulp.task(task, getTask(task));
});


gulp.task('dev', (cb) => {
  $.rs(
    'default',
    'watch',
    cb
  );
});


gulp.task('default', (cb) => {
  $.rs(
    'clean',
    ['styles', 'scripts', 'templates', 'images'],
    cb
  );
});
