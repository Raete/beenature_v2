const   gulp         = require('gulp'),
        browserSync  = require('browser-sync').create(),
        reload       = browserSync.reload,
        autoprefixer = require('gulp-autoprefixer'),
        cleanCSS     = require('gulp-clean-css'),
        include      = require('gulp-include'),
        plumber      = require('gulp-plumber'),
        rename       = require('gulp-rename'),
        sass         = require('gulp-sass'),
        sourcemaps   = require('gulp-sourcemaps'),
        uglify       = require('gulp-uglify');

// create css from scss, autoprefixer, browser-sync
gulp.task('styles', () => {
    return gulp.src('src/scss/main-style.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions', '> .5%', 'android 4', 'ios 8']
    }))
    .pipe(cleanCSS({
        level: {
            1: {
                specialComments: 0
            },
            2: {}
        }
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

//minify js
gulp.task('scripts', () => {
    return gulp.src('src/js/script.js')
    .pipe(plumber())
    .pipe(include())
    .pipe(rename({basename: 'script'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './',
            index : "index.html"
        }
    });
});

gulp.task('build', ['styles', 'scripts']);

//watch changes
gulp.task('watch', ['browser-sync', 'build'], () => {
    gulp.watch('src/scss/*.scss', ['styles']);
    gulp.watch('src/js/main.js', ['scripts']);
    gulp.watch('*.html').on('change', reload);
});

gulp.task('default', ['watch']);
