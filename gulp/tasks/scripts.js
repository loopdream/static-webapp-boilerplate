
module.exports = (gulp, config, $) => {
    return () => {

    	var stream = gulp.src([config.paths.srcScripts + '/**/*.js'])
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
        .pipe($.if(config.minify, $.rename({
            suffix: '.min'
        })))
        .pipe($.if(config.minify, $.uglify()))
        .pipe(gulp.dest(config.paths.distScripts))
        .pipe($.bs.reload({stream:true}));

    	return stream;
        
    };
};