// TASK VERIFY
// verify:client
// verify:server
module.exports = (gulp, $, config) => {

  gulp.task('verify:client', () => {
    gulp.src([config.to.client.dev.js.all])
      .pipe($.eslint())
      .pipe($.eslint.format());
  });

  gulp.task('verify:server', () => {
    gulp.src([config.to.server.dev.js.all])
      .pipe($.eslint())
      .pipe($.eslint.format());
  });

  gulp.task('verify', ['verify:client', 'verify:server']);
};


