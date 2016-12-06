module.exports = function (grunt) {

    grunt.initConfig({


        /**
            Configuration
        **/
        pkg: grunt.file.readJSON('package.json'),


        /**
            Paths
            Use ex: '<%= path.src.js %>/main.js' -> 'src/js/main.js'
        **/
        path: {
            // Source
            src: {
                css: 'scss',
                img: 'images',
                js: 'js',
                fonts: 'fonts',
                html: 'html',
            },

            // Distribution
            dist: {
                css: 'dist/assets/css',
                img: 'dist/assets/images',
                js: 'dist/assets/js',
                fonts: 'dist/assets/fonts',
                html: 'dist',
            },

            // Zurb Foundation
            zf: 'bower_components/foundation-sites',
        },


        /**
            Watch our files for changes and live-reload
            https://github.com/gruntjs/grunt-contrib-watch
        **/
        watch: {
            options: {
                livereload: true,
            },

            gruntfile: {
                files: 'Gruntfile.js',
                options: {
                    reload: true
                }
            },

            css: {
                files: ['<%= path.src.css %>/**/*.{sass,scss,css}'],
                tasks: ['sass'],
                options: {
                    livereload: true,
                },
            },

            //js: {
            //    files: '<%= path.src.js %>/**/*.js',
            //    tasks: ['uglify:default'],
            //},

            html: {
                files: '<%= path.src.html %>/**/*.html',
                tasks: ['includes'],
                options: {
                    livereload: true,
                },
            },
        },


        /**
            Compile our SASS
            https://github.com/sindresorhus/grunt-sass
        **/
        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true,
                includePaths: ['<%= path.zf %>/scss', 'bower_components/motion-ui/src'],
            },
            default: {
                files: {
                    '<%= path.dist.css %>/foundation.css': '<%= path.src.css %>/zurbfoundation.scss',
                    '<%= path.dist.css %>/style.css': '<%= path.src.css %>/styles.sass',
                }
            }
        },


        /**
            Finish off our CSS with PostCSS (& plugins)
            https://github.com/nDmitry/grunt-postcss
        **/
        postcss: {
            default: {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: ['last 2 versions']}),
                    ]
                },
                src: '<%= path.dist.css %>/*.css',
            },
            dist: {
                options: {
                    processors: [
                        /**
                         * Plugins:
                         *
                         * AutoPrefixer:
                         * Pixrem: https://github.com/robwierzbowski/node-pixrem
                         * CSSNano: https://github.com/ben-eb/cssnano
                         * CSS MqPacker: https://github.com/hail2u/node-css-mqpacker
                         */
                        require('autoprefixer')({ // Add vendor prefixes
                            browsers: [
                                'last 2 versions',
                                'ie 8-9',
                            ]
                        }),
                        require('pixrem')(),                    // Add fallback units for rem
                        require('cssnano')(),                   // Minify our css
                        require('css-mqpacker')({sort: true}),  // Combine media queries
                    ]
                },
                src: '<%= path.dist.css %>/*.css',
            }
        },


        /**
            Remove un-used CSS
            https://github.com/addyosmani/grunt-uncss
        **/
        uncss: {
            dist: {
                options: {
                    ignore: ['.js-*']
                },
                files: {
                    '<%= path.dist.css %>/main.css': '<%= path.dist.html %>/**/*.html'
                }
            }
        },


        /**
            Minify our images
            https://github.com/gruntjs/grunt-contrib-imagemin
        **/
        imagemin: {
            default: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.src.img %>/',
                    src: ['**/*.{png,jpg,jpeg,gif,svg}'],
                    dest: '<%= path.dist.img %>'
                }]
            }
        },


        /**
            Concatenate HTML files
            https://github.com/vanetix/grunt-includes
        **/
        includes: {
            default: {
                files: [{
                    cwd: '<%= path.src.html %>/',
                    src: '*.html',
                    dest: '<%= path.dist.html %>',
                    flatten: true
                }]
            }
        },


        /**
            Copy files
            https://github.com/gruntjs/grunt-contrib-copy
        **/
        copy: {
            default: {
                files: [
                    // CSS
                    {
                        expand: true,
                        cwd: '<%= path.src.css %>/other/',
                        src: '*',
                        dest: '<%= path.dist.css %>/',
                        filter: 'isFile'
                    },

                    // Images
                    {
                        expand: true,
                        cwd: '<%= path.src.img %>',
                        src: '**',
                        dest: '<%= path.dist.img %>/',
                        filter: 'isFile'
                    },

                    // JS
                    {
                        expand: true,
                        cwd: '<%= path.src.js %>',
                        src: '*',
                        dest: '<%= path.dist.js %>/',
                        filter: 'isFile'
                    },

                    // Fonts
                    {
                        expand: true,
                        cwd: '<%= path.src.fonts %>',
                        src: '**',
                        dest: '<%= path.dist.fonts %>/',
                        filter: 'isFile'
                    },
                ],
            },
        },


        /**
            Combine JS files
            https://github.com/gruntjs/grunt-contrib-concat
        **/
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            default: {
                files: {
                    '<%= path.dist.js %>/jquery.js': 'bower_components/jquery/dist/jquery.js',
                    '<%= path.dist.js %>/what-input.js': 'bower_components/what-input/what-input.js',
                    '<%= path.dist.js %>/foundation.js': [
                        // Core Foundation files
                        '<%= path.zf %>/js/foundation.core.js',
                        '<%= path.zf %>/js/foundation.util.*.js',

                        // Individual Foundation components
                        // If you aren't using a component, just remove it from the list
                        '<%= path.zf %>/js/foundation.abide.js',
                        '<%= path.zf %>/js/foundation.accordion.js',
                        '<%= path.zf %>/js/foundation.accordionMenu.js',
                        '<%= path.zf %>/js/foundation.drilldown.js',
                        '<%= path.zf %>/js/foundation.dropdown.js',
                        '<%= path.zf %>/js/foundation.dropdownMenu.js',
                        '<%= path.zf %>/js/foundation.equalizer.js',
                        '<%= path.zf %>/js/foundation.interchange.js',
                        '<%= path.zf %>/js/foundation.magellan.js',
                        '<%= path.zf %>/js/foundation.offcanvas.js',
                        '<%= path.zf %>/js/foundation.orbit.js',
                        '<%= path.zf %>/js/foundation.responsiveMenu.js',
                        '<%= path.zf %>/js/foundation.responsiveToggle.js',
                        '<%= path.zf %>/js/foundation.reveal.js',
                        '<%= path.zf %>/js/foundation.slider.js',
                        '<%= path.zf %>/js/foundation.sticky.js',
                        '<%= path.zf %>/js/foundation.tabs.js',
                        '<%= path.zf %>/js/foundation.toggler.js',
                        '<%= path.zf %>/js/foundation.tooltip.js',
                    ],
                }
            },
        },


        /**
            Transform ES6 to ES5 for Uglify use
            https://github.com/babel/grunt-babel
        **/
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    '<%= path.dist.js %>/app.js': '<%= path.dist.js %>/app.js'
                }
            }
        },


        /**
            Minify JS files
            https://github.com/gruntjs/grunt-contrib-uglify
        **/
        uglify: {
            options: {
                mangle: {
                    except: ['jQuery']
                }
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.dist.js %>',
                    src: '**/*.js',
                    dest: '<%= path.dist.js %>'
                }]
            }
        },


    });


    /**
     * Load Grunt tasks automatically
     */
    require('load-grunt-tasks')(grunt);


    /**
     * Register tasks
     */

    // Build our CSS and JS files
    grunt.registerTask('build', ['includes', 'sass', 'copy', 'concat']);

    // Watch our files and compile if any changes
    grunt.registerTask('default', ['build', 'watch']);

    // Production - Build the files for production use
    grunt.registerTask('production', ['includes', 'sass', 'uncss', 'postcss:dist', 'imagemin', 'concat', 'babel', 'uglify']);

}
