var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var pug = require('gulp-pug');
var minifyHtml = require('gulp-minify-html');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var argv = require('yargs').argv;
var fs = require('fs');
var yaml = require('js-yaml');

var config = {
  environment: argv.environment || 'local',
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
  },
  defaultPort: 3000,
  minify: argv.minify || false
}

var readYamlFile = (file) => {
  var dataFile = config.paths.data + file;
  return fs.existsSync(dataFile) ? yaml.safeLoad(fs.readFileSync(dataFile, 'utf8')) : {};
};


// Clean up output directory
gulp.task('clean', () => {
  return gulp.src(config.paths.dist+ '/*', {read: false})
    .pipe(clean());
});


gulp.task('styles',()=>{

    gulp.src([config.paths.srcStyles  + '/main.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
              require('node-bourbon').includePaths, 
              require('node-neat').includePaths
            ]
        }))
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        // .pipe(csslint.reporter())
        .pipe(gulp.dest(config.paths.distStyles))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.distStyles))
        .pipe(reload({stream:true}))
});



gulp.task('scripts',()=>{
    gulp.src([config.paths.srcScripts + '/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserify())
        .pipe(gulp.dest(config.paths.distScripts))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.distScripts))
        .pipe(reload({stream:true}))
});



gulp.task('templates',()=>{

    var data = readYamlFile('/global.yaml');
    console.log(data);
    gulp.src([config.paths.templates + '/**/*.pug'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug({pretty: true, data: data}))
        .pipe(minifyHtml())
        .pipe(gulp.dest(config.paths.dist))
        .pipe(reload({stream:true}))
});


gulp.task('images',()=>{
    gulp.src([config.paths.srcImages + '/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest(config.paths.distImages))
        .pipe(reload({stream:true}))
});


gulp.task('watch', ()=> {
  if (config.environment==='local') {
    browserSync.init({
        port: config.defaultPort,
        server: config.paths.dist
    });
    gulp.watch(config.paths.srcStyles + '/**/*.js',['scripts']);
    gulp.watch(config.paths.srcStyles + '/**/*.sass',['styles']);
    gulp.watch(config.paths.templates + '/**/*.pug',['templates']);
    gulp.watch(config.paths.srcImages + '/**/*',['images']);
  };

});



gulp.task('default', (cb) => {

    runSequence(
      'clean',
      ['styles', 'scripts', 'templates', 'images'],
      'watch',
      cb
    );

});
