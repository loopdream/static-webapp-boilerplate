var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var fs = require('fs');
var yaml = require('js-yaml');
var gulpif = require('gulp-if');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();

var config = {
  defaultPort: 3000,
  environment: argv.environment || 'local',
  minify: argv.minify || false,
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

var readYamlFile = (file) => {
  var dataFile = config.paths.data + file;
  return fs.existsSync(dataFile) ? yaml.safeLoad(fs.readFileSync(dataFile, 'utf8')) : {};
};


// Clean up output directory
gulp.task('clean', ()=> {
  return gulp.src(config.paths.dist+ '/*', {read: false})
    .pipe($.clean());
});


gulp.task('styles', ()=> {

    gulp.src([config.paths.srcStyles  + '/main.scss'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            includePaths: [
              require('node-bourbon').includePaths, 
              require('node-neat').includePaths
            ]
        }))
        .pipe($.autoprefixer())
        .pipe($.csscomb())
        .pipe($.mergeMediaQueries({log:true}))
        .pipe($.csslint())
        // .pipe($.csslint.reporter())
        .pipe(gulp.dest(config.paths.distStyles))
        .pipe(gulpif(config.minify, $.rename({
            suffix: '.min'
        })))
        .pipe(gulpif(config.minify, $.cleanCss()))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.paths.distStyles))
        .pipe(reload({stream:true}))
});



gulp.task('scripts',()=> {
    gulp.src([config.paths.srcScripts + '/**/*.js'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.concat('main.js'))
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.browserify())
        .pipe(gulp.dest(config.paths.distScripts))
        .pipe(gulpif(config.minify, $.rename({
            suffix: '.min'
        })))
        .pipe(gulpif(config.minify, $.uglify()))
        .pipe(gulp.dest(config.paths.distScripts))
        .pipe(reload({stream:true}))
});



gulp.task('templates', ()=> {
    var data = readYamlFile('/global.yaml');
    var templateData = Object.assign(config, data);
    /* Insert any specific data manipulatiopn here */
    gulp.src([config.paths.templates + '/**/*.pug'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.pug({pretty: true, data: templateData}))
        .pipe(gulpif(config.minify, $.minifyHtml()))
        .pipe(gulp.dest(config.paths.dist))
        .pipe(reload({stream:true}))
});


gulp.task('images', ()=> {
    gulp.src([config.paths.srcImages + '/**/*'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(config.paths.distImages))
        .pipe(reload({stream:true}))
});


gulp.task('watch', ()=> {
    browserSync.init({
        port: config.defaultPort,
        server: config.paths.dist
    });
    gulp.watch(config.paths.srcStyles + '/**/*.js',['scripts']);
    gulp.watch(config.paths.srcStyles + '/**/*.scss',['styles']);
    gulp.watch([config.paths.templates + '/**/*.pug', config.paths.data + '/**/*.yaml'],['templates']);
    gulp.watch(config.paths.srcImages + '/**/*',['images']);
});



gulp.task('dev', (cb) => {
    runSequence(
      'default',
      'watch',
      cb
    );
});


gulp.task('default', (cb) => {
    runSequence(
      'clean',
      ['styles', 'scripts', 'templates', 'images'],
      cb
    );
});
