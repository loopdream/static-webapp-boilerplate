const gulp        = require('gulp');

/* Create a global object of gulp + node plugins */
const $ = Object.assign({
  bs:   require('browser-sync').create(),
  rs:   require('run-sequence'),
  argv: require('yargs').argv,
  fs:   require('fs'),
  yaml: require('js-yaml'),
  _:    require('lodash')
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


$.fs.readdir( './gulp/tasks/', ( err, files ) => {
  $._.each(files, (file)=> {
    console.log(file)
    var name = file.substr(0, file.lastIndexOf('.'));
    gulp.task(name, getTask(name));
  });
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
