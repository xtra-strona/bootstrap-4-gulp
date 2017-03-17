var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var zip = require('gulp-zip');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'copy-fonts', 'copy-js'], function() {

    browserSync.init({
        server: "./",
        // browser: "chrome"
        // browser: "firefox"
    });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")

        .pipe(sourcemaps.init())

        .pipe(sass({
            outputStyle: 'nested', // nested,compact,expanded,compressed
        }).on('error', sass.logError))

        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'Firefox >= 14']
        }))

        .pipe(sourcemaps.write('.'))

        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

//Compress SCSS File
gulp.task('minify-css', function() {

    return gulp.src("scss/*.scss")

        .pipe(sass({
            outputStyle: 'compressed', // nested,compact,expanded,compressed
        }).on('error', sass.logError))

        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'Firefox >= 14']
        }))

        .pipe(gulp.dest("css"))

});

//Create Folder build with zip package
gulp.task('zip', ['minify-css'], () =>
    gulp.src([
        './**', '!./assets/img/raw{,/**/*}',
        '!./build-template{,/**/*}',
        '!./bower_components{,/**/*}',
        '!./node_modules{,/**/*}',
        '!./bower.json',
        '!./css/master.css.map',
        '!package.json',
        '!gulpfile.js',
        '!.gitignore',
        '!README.md',
        './master',
    ])
    .pipe(zip('your-page.zip'))
    .pipe(gulp.dest('./build'))
);

gulp.task('copy-fonts', function() {
    gulp.src('./bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./fonts'));
});

gulp.task('copy-js', function() {
    gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/jquery/dist/jquery.slim.min.js',
            './bower_components/bootstrap/dist/js/bootstrap.min.js',
            './bower_components/tether/dist/js/tether.min.js'
        ])
        .pipe(gulp.dest('./js'));
});

//Watch For changes
gulp.task('watch', ['serve']);

//Build Package zip
gulp.task('build', ['zip']);
