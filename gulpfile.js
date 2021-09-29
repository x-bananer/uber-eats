const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

const { DIST_PATH, SRC_PATH, STYLES_LIBS } = require('./gulp.config.js');

task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(rm())
});

task('copy:html', () => {
  return src(`${SRC_PATH}/*.html`)
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('fonts', function () {
  return src('src/fonts/*')
    .pipe(dest(`${DIST_PATH}/fonts`))
    .pipe(reload({ stream: true }));
})

task('styles', () => {
  return src([...STYLES_LIBS, `${SRC_PATH}/styles/main.scss`])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(px2rem({
      dpr: 1,
      rem: 16
    }))
    .pipe(gulpif(env === 'prod', autoprefixer({
      cascade: false
    })))
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('scripts:store', () => {
  return src([`${SRC_PATH}/scripts/store/*.js`])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('store.min.js', { newLine: ';' }))
    .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('scripts:restaurant', () => {
  return src([`${SRC_PATH}/scripts/restaurant/*.js`])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('restaurant.min.js', { newLine: ';' }))
    .pipe(gulpif(env === 'prod', babel({
      presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
});

task('icons', () => {
  return src(`${SRC_PATH}/images/icons/*.svg`)
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: {
              attrs: '(fill|stroke|style|width|height|data.*)'
            }
          }
        ]
      })
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest(`${DIST_PATH}/images/icons`));
});

task('copy:svg', () => {
  return src(`${SRC_PATH}/images/*.svg`)
    .pipe(dest(`${DIST_PATH}/images`))
    .pipe(reload({ stream: true }));
});

task('copy:png', () => {
  return src(`${SRC_PATH}/images/*.png`)
    .pipe(dest(`${DIST_PATH}/images`))
    .pipe(reload({ stream: true }));
});

task('server', () => {
  browserSync.init({
    files: ['/store.html', '/restaurant.html'],
    server: {
      baseDir: `./${DIST_PATH}`,
    },
    open: false
  });
});

task('watch', () => {
  watch(`./${SRC_PATH}/styles/**/*.scss`, series('styles'));
  watch(`./${SRC_PATH}/*.html`, series('copy:html'));
  watch(`./${SRC_PATH}/scripts/store/*.js`, series('scripts:store'));
  watch(`./${SRC_PATH}/scripts/restaurant/*.js`, series('scripts:restaurant'));
  watch(`./${SRC_PATH}/images/icons/*.svg`, series('icons'));
  watch(`./${SRC_PATH}/images/*.svg`, series('copy:svg'));
  watch(`./${SRC_PATH}/images/*.png`, series('copy:png'));
});

task(
  'default',
  series(
    'clean',
    parallel('copy:html', 'fonts', 'styles', 'scripts:store', 'scripts:restaurant', 'icons', 'copy:svg', 'copy:png'),
    parallel('watch', 'server')
  )
);

task(
  'build',
  series(
    'clean',
    parallel('copy:html', 'fonts', 'styles', 'scripts:store', 'scripts:restaurant', 'icons', 'copy:svg', 'copy:png')
  )
);
