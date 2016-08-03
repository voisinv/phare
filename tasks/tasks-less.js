
module.exports = (gulp, $, config) => {
  gulp.task('build:css', () => {
    return gulp.src(config.to.client.dev.css.all)
      .pipe($.less())
      .pipe($.concat('app.css'))
      .pipe(gulp.dest(config.to.client.build.css.main));
  });
};
