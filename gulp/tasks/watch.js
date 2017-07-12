module.exports = (gulp, config, $) => {
  return () => {
      
    $.bs.init({
        port: config.defaultPort,
        server: config.paths.dist
    });
    gulp.watch(config.paths.srcStyles + '/**/*.js',['scripts']);
    gulp.watch(config.paths.srcStyles + '/**/*.scss',['styles']);
    gulp.watch([config.paths.templates + '/**/*.pug', config.paths.data + '/**/*.yaml'],['templates']);
    gulp.watch(config.paths.srcImages + '/**/*',['images']);
      
  };
};