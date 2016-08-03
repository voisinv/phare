require('vinyl-buffer');
module.exports = (gulp, $, config) => {


  gulp.task('build:js', ['build:js:client', 'build:js:server']);

  gulp.task('build:js:client', () => {
    return $.browserify(config.to.client.dev.js.main)
      .transform($.babelify, {presets: ['es2015']})
      .bundle()
      .pipe($.vinylSourceStream(config.to.client.build.js.main))
      .pipe(gulp.dest(config.to.build.directory.client));
  });
  gulp.task('build:js:server', () => {
    return gulp.src(config.to.server.dev.js.all)
      .pipe(gulp.dest(config.to.build.directory.server));
  });
};

