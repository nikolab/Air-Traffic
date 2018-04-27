var gulp = require ( 'gulp' );
var rename = require( 'gulp-rename' );
var sass = require( 'gulp-sass' );
var uglify = require( 'gulp-uglify' );
var autoprefixer = require( 'gulp-autoprefixer' );
var sourcemaps = require( 'gulp-sourcemaps' );
var browserify = require( 'browserify' );
var babelify = require( 'babelify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var imagemin = require('gulp-imagemin');
//var scsslint = require('gulp-scss-lint');
var jshint = require('gulp-jshint');
var browserSync = require( 'browser-sync' ).create();
var reload = browserSync.reload;

//Change paths Src and Dist according to your project
//Style src and dist
var styleSrc = 'src/scss/style.scss';
var styleDist = './dist/css/';
var styleWatch = 'src/scss/**/*.scss';

//Scripts src and dist
var scriptSrc = 'script.js';
var scriptFolder = 'src/js/';
var scriptDist = './dist/js/';
var scriptWatch = 'src/js/**/*.js';
var jsFiles = [scriptSrc];

//Images src and dist
var imgSrc = 'src/images/*';
var imgDist = 'dist/images';

var htmlWatch = '**/*.html';
var phpWatch = '**/*.php';

gulp.task( 'browser-sync', function(){
    browserSync.init({
        server: {
           baseDir: "./",
            open: true,
            injectChanges: true
           //  proxy: 'https://gulp.dev',
           //  https: {
           //      key: '//Users/Nikola/.valet/Certificates/gulp.dev.key',
           //      cert: '//Users/Nikola/.valet/Certificates/gulp.dev.crt'
           //  }
        }
    });
});

// Styles
gulp.task( 'style', function () {
gulp.src( styleSrc )
    .pipe( sourcemaps.init() )
    .pipe( sass ({
        errorLogToConsole: true,
        outputStyle: 'compressed'
    }) )
    .on( 'error', console.error.bind( console ) )
    .pipe( autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }) )
    .pipe( rename( { suffix: '.min' }) )
    .pipe( sourcemaps.write('./') )
    .pipe( gulp.dest( styleDist ) )
    .pipe( browserSync.stream() );
});

// Scripts
gulp.task('script', function () {
    jsFiles.map( function ( entry ) {
        return browserify ({
            entries: [scriptFolder + entry]
        })
            .transform( babelify, { presets: ['env'] } )
            .bundle()
            .pipe( source( entry ) )
            .pipe( rename ({ extname: '.min.js'}) )
            .pipe ( buffer() )
            .pipe( sourcemaps.init({ loadMaps: true }) )
            .pipe( uglify() )
            .pipe( sourcemaps.write('./') )
            .pipe( gulp.dest( scriptDist ))
            .pipe( browserSync.stream() );
    });
});


//Images and SVG
gulp.task('image', function(){
    gulp.src( imgSrc )
        .pipe( imagemin({
            progressive: true,
            optimizationLevel: 7,
            interlaced: true
        }) )
        .pipe( gulp.dest( imgDist ) );
});


//JShint
gulp.task('jshint', function() {
    return gulp.src( scriptSrc )
        .pipe(reload({stream: true, once: true}))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['style', 'script']);

gulp.task('watch', ['default', 'browser-sync'], function () {
    gulp.watch( styleWatch, ['style'] );
    gulp.watch( scriptWatch, ['script', reload ] );
    gulp.watch( htmlWatch, reload );
    gulp.watch( phpWatch, reload );
});