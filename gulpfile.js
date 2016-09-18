var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    iife = require("gulp-iife");

var scripts = {
    angular: ['./node_modules/angular/angular.js', './node_modules/angular-messages/angular-messages.js'],
    app: ['./src/js/app.js', './src/js/*.js'],
    helpers: './src/helpers/*.js'
};
gulp.task('scripts', function(){

    gulp.src(scripts.angular)
        .pipe(concat('angular.js'))
        .pipe(gulp.dest('./prod/js/'));

    gulp.src(scripts.app)
        .pipe(concat('kz-form-daimyo.js'))
        .pipe(iife())
        .pipe(gulp.dest('./prod/js/'));

    gulp.src(scripts.app)
        .pipe(uglify())
        .pipe(concat('kz-form-daimyo.min.js'))
        .pipe(iife())
        .pipe(gulp.dest('./prod/js/'));

    gulp.src(scripts.helpers)
        .pipe(concat('helpers.js'))
        .pipe(gulp.dest('./prod/js/'));
});

var styles = './src/content/*.scss';
gulp.task('styles', function(){
    gulp.src(styles)
        .pipe(sass({
            outputStyle: 'expanded',//'compact',//'compressed',
        }).on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./prod/content/'));
});

gulp.task('default', ['scripts', 'styles'], function(){
    gulp.watch([scripts.app, scripts.helpers], ['scripts']);
    gulp.watch(styles, ['styles']);
});