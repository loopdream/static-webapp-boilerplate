module.exports = (gulp, config, $) => {
    
    return () => {

        var readYamlFile = (file) => {

          var dataFile = config.paths.data + file;
          return $.fs.existsSync(dataFile) ? $.yaml.safeLoad($.fs.readFileSync(dataFile, 'utf8')) : {};
        };

        var data = readYamlFile('/global.yaml');
        var templateData = Object.assign(config, data);

        /* Insert any specific data manipulatiopn here */
    	   var stream = gulp.src([config.paths.templates + '/**/*.pug'])
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.pug({pretty: true, data: templateData}))
        .pipe($.if(config.minify, $.minifyHtml()))
        .pipe(gulp.dest(config.paths.dist))
        .pipe($.bs.reload({stream:true}));

    	return stream;

    };
};