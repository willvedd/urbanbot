var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    livereload = require('gulp-livereload');
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    stylesDir = 'public/styles';


gulp.task('styles', function() {
    return sass(stylesDir, { style: 'expanded' })
        .pipe(gulp.dest(stylesDir))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename('style.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(stylesDir))
});  

gulp.task('watch', function() {
  gulp.watch( stylesDir + '/*.scss', ['styles']);
});


gulp.task('default', function() {
    gulp.start('watch','styles');
});