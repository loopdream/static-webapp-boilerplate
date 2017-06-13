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


// Clean up output directory
gulp.task('clean', () => {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});


gulp.task('sass',()=>{
    gulp.src(['src/assets/styles/**/*.sass'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [require('node-bourbon').includePaths, require('node-neat').includePaths]
        }))
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        // .pipe(csslint())
        // .pipe(csslint.reporter())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe(reload({stream:true}))
});
gulp.task('js',()=>{
    gulp.src(['src/assets/scripts/main.js'])
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
        .pipe(gulp.dest('dist/assets/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/scripts'))
        .pipe(reload({stream:true}))
});
gulp.task('pug',()=>{
    gulp.src(['src/templates/pages/**/*.pug'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug())
        .pipe(minifyHtml())
        .pipe(gulp.dest('./dist'))
        .pipe(reload({stream:true}))
});
gulp.task('image',()=>{
    gulp.src(['src/images/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({stream:true}))
});

gulp.task('default', ['clean', 'js', 'pug'],()=>{
    browserSync.init({
        server: "./dist"
    });
    gulp.watch('src/assets/scripts/**/*.js',['js']);
    gulp.watch('src/assets/styles/**/*.sass',['sass']);
    gulp.watch('src/templates/**/*.pug',['pug']);
    gulp.watch('src/images/**/*',['image']);
});
