var gulp = require('gulp'),
    scss = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps');
    pug  = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    browserSync = require('browser-sync'),
    series = require('gulp-series');
	autoprefixer = require('gulp-autoprefixer');
	concat = require('gulp-concat');
	cssmin = require('gulp-cssmin');
	imagemin = require('gulp-imagemin');
	babel = require('gulp-babel');
	jsmin = require('gulp-jsmin');
	htmlbeautify = require('gulp-html-beautify');
    postcss = require('gulp-postcss');
    postcssflex = require('postcss-flexibility');


var res = {
    src: './src/',
    dest: './site/',
	images: {
        src: 'images/',
        dest: 'images/'
    },
    styles: {
        src: 'styles/',
        dest: 'styles/'
    },
    scripts: {
        src: 'scripts/',
        dest: 'scripts/'
    },
    pug: {
        src: 'pug/',
        dest: ''
    },
    icons: {
        src: 'icons/',
        dest: 'icons/'
    },
    fonts: {
        src: 'fonts/',
        dest: 'fonts/'
    },
    media: {
        src: 'media/',
        dest: 'media/'
    },    
    slick: {
        src: 'slick/',
        dest: 'slick/'
    }    
}

// *** УДАЛЕНИЕ ВСЕГО ИЗ ПАПКИ НАЗНАЧЕНИЯ ***
gulp.task('clean', function() {
    return del([res.dest+'*'])
})

// *** КОМПИЛЯЦИЯ SCSS-ФАЙЛОВ ***
gulp.task('styles', function() {
    return gulp.src(res.src+res.styles.src+'style.scss')
    .pipe(plumber())
	.pipe(sourcemaps.init())
    .pipe(scss())
    .pipe(postcss([postcssflex]))
    .pipe(autoprefixer({
		browsers: ['last 5 versions'],
		cascade: false
	}))
	.pipe(concat('style.css'))
	.pipe(sourcemaps.write())
    .pipe(gulp.dest(res.dest+res.styles.dest))	
    .on('end', browserSync.reload);
});

// *** КОМПИЛЯЦИЯ SCSS-ФАЙЛОВ НА ПРОДАКШН***
gulp.task('stylesReady', function() {
    return gulp.src(res.src+res.styles.src+'style.scss')
    .pipe(plumber())
    .pipe(scss())
    .pipe(postcss([postcssflex]))
    .pipe(autoprefixer({
		browsers: ['last 5 versions'],
		cascade: false
	}))
	.pipe(concat('style.css'))
	.pipe(cssmin())
    .pipe(gulp.dest(res.dest+res.styles.dest))	
    .on('end', browserSync.reload);
});

// *** КОМПИЛЯЦИЯ PUG-ФАЙЛОВ ***
gulp.task('pug', function() {
    return gulp.src(res.src+res.pug.src+'*.pug')
    .pipe(plumber())    
    .pipe(pug({
	pretty: true
	}))
    .pipe(gulp.dest(res.dest+res.pug.dest))
    .on('end', browserSync.reload);
})

// *** КОМПИЛЯЦИЯ PUG-ФАЙЛОВ В ПРОДАКШН ***
gulp.task('pugReady', function() {
    return gulp.src(res.src+res.pug.src+'*.pug')
    .pipe(plumber())    
    .pipe(pug())
    .pipe(gulp.dest(res.dest+res.pug.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ КАРТИНОК ***
gulp.task('images', function() {
    return gulp.src(res.src+res.images.src+'**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(plumber())
    .pipe(imagemin())
	.pipe(gulp.dest(res.dest+res.images.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ иконок ***
gulp.task('icons', function() {
    return gulp.src(res.src+res.icons.src+'**/*.+(svg)')
    .pipe(plumber())
    .pipe(gulp.dest(res.dest+res.icons.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ slick ***
gulp.task('slick', function() {
    return gulp.src(res.src+res.slick.src+'**/*.+(css|js|eot|ttf|woff|rb|gif)')
    .pipe(plumber())
    .pipe(gulp.dest(res.dest+res.slick.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ видео ***
gulp.task('media', function() {
    return gulp.src(res.src+res.media.src+'**/*.+(mp4|webm|ogv)')
    .pipe(plumber())
    .pipe(imagemin())
	.pipe(gulp.dest(res.dest+res.media.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ ШРИФТОВ ***
gulp.task('fonts', function() {
    return gulp.src(res.src+res.fonts.src+'*.*')
    .pipe(plumber())
    .pipe(gulp.dest(res.dest+res.fonts.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ СКРИПТОВ ***
gulp.task('scripts', function() {
    return gulp.src(res.src+res.scripts.src+'*.js')
    .pipe(plumber())
    .pipe(babel())   
    .pipe(concat('index.js'))
    .pipe(sourcemaps.init())	
	.pipe(sourcemaps.write('.'))     
	.pipe(gulp.dest(res.dest+res.scripts.dest))
    .on('end', browserSync.reload);
})

// *** КОПИРОВАНИЕ СКРИПТОВ НА ПРОДАКШН***
gulp.task('scriptsReady', function() {
    return gulp.src(res.src+res.scripts.src+'*.js')
    .pipe(plumber())
	.pipe(babel())
	.pipe(concat('index.js'))	
	.pipe(jsmin())
	.pipe(gulp.dest(res.dest+res.scripts.dest))
    .on('end', browserSync.reload);
})

// *** ЗАПУСК СЕРВЕРА ***
gulp.task('server', function() {
    browserSync({
        ui: {
            port: 5001
        },
        server: {
            baseDir: res.dest
        },
        port: 5000
    })
})

// *** СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЕМ ФАЙЛОВ ***
gulp.task('watch', function () {
    gulp.watch(res.src+res.styles.src+'**/*.scss', gulp.series('styles'));
    gulp.watch(res.src+res.pug.src+'**/*.pug', gulp.series('pug'));
    gulp.watch(res.src+res.images.src+'**/*.+(png|jpg|jpeg|gif|svg)', gulp.series('images'));
    gulp.watch(res.src+res.media.src+'**/*.+(mp4|webm|ogv)', gulp.series('media'));
    gulp.watch(res.src+res.fonts.src+'*.*', gulp.series('fonts'));
    gulp.watch(res.src+res.icons.src+'**/*.+(svg)', gulp.series('icons'));
    gulp.watch(res.src+res.slick.src+'**/*.+(css|js|eot|ttf|woff|rb|gif)', gulp.series('slick'));
    gulp.watch(res.src+res.scripts.src+'*.js', gulp.series('scripts'));
})

// *** ЗАПУСК ВСЕГО ***
gulp.task('default', gulp.series(
        'clean',
        gulp.parallel('styles','images','pug', 'fonts', 'media', 'icons', 'slick', 'scripts'),
        gulp.parallel('server','watch')
    )
)

// *** ЗАПУСК ВСЕГО НА ПРОДАКШН***
gulp.task('ready', gulp.series(
        'clean',
        gulp.parallel('stylesReady','images','pugReady', 'fonts', 'media', 'icons', 'slick', 'scriptsReady')
    )
)

