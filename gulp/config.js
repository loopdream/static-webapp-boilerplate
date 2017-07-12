module.exports = function (gulp, config, $) {
  return {
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
};