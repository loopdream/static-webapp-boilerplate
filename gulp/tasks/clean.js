module.exports = (gulp, config, $, browserSync) => {
    return () => {
    	return gulp.src(config.paths.dist+ '/*', {read: false}).pipe($.clean());
    };
};