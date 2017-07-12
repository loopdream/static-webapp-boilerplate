module.exports = (gulp, config, $) => {
    return () => {
        
    	var stream = gulp.src([config.paths.srcImages + '/**/*'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(config.paths.distImages))
        .pipe($.bs.reload({stream:true}));

    	return stream;
        
    };
};