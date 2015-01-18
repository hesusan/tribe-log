module.exports = function(grunt) {

	//グラントタスクの設定
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		image: {
			static: {
				files: {
				}
			},
      //方法を検討中...
			dynamic: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'images/'
				}]
			}
		},

		//concatの設定
		concat: {
			index_js: {
				src: [
					"assets/js/vendor/jquery-2.1.1.min.js",
					//"assets/js/vendor/jquery.min.js",
					"assets/js/vendor/plugin.js",
					"assets/js/vendor/imagesloaded.pkgd.js",
					"assets/js/vendor/isotope.pkgd.min.js",
					"assets/js/vendor/jquery.hashchange.js",
					"assets/js/vendor/ImgLoader.js",
					"assets/js/vendor/fastclick.js",
					"assets/js/vendor/rAF.js",
					"assets/js/namespace.js",
					"assets/js/Util.js",
					"assets/js/ResizeManager.js",
					"assets/js/MenuManager.js",
					"assets/js/SiteScroller.js",
					"assets/js/Scroll.js",
					"assets/js/Accordion.js",
					"assets/js/Slider.js",
					"assets/js/Gallery.js",
					//"assets/js/ElementsSizeAdjuster.js",
					"assets/js/Application.js"
				],
				dest : "js/index.js"
			}
		},

		//圧縮する
		uglify : {
			index_js : {
				src : [ "js/index.js" ],
				dest : "js/index.js"
			}
		},

		//Compass
		compass : {
			dist : {
				options: {
					config : "config.rb"
				}
			}
		},

		//watchの設定
		watch: {
			script: {
				files: ['assets/js/**/*.js'],
				tasks: ['concat','uglify']
				//tasks: ['concat']
			},
			style: {
				files: ['assets/scss/**/*.scss'],
				tasks: ['compass']
			}//,
			//images: {
				//cwd: 'i/game/pre_register/12019106/sp/',
				//files: ['**/*.{png,jpg,gif,svg}'],
				//tasks: ['image']
			//}
		}
	});//grunt

	//プラグインの読み込み
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-image');

	grunt.registerTask( 'default', ['watch']);

};
