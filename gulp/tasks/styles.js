var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;

module.exports = (gulp, config, $) => {
    return () => {
    	
    	var stream = gulp.src([config.paths.srcStyles  + '/main.scss'])
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
    	    .pipe($.if(config.minify, $.rename({
    	        suffix: '.min'
    	    })))
    	    .pipe($.if(config.minify, $.cleanCss()))
    	    .pipe($.sourcemaps.write())
    	    .pipe(gulp.dest(config.paths.distStyles))
    	    .pipe($.bs.reload({stream:true}));

    	return stream;
    };
};