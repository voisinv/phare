
const gls = require('gulp-live-server');
const nodemon = require('gulp-nodemon');
const lr = require('tiny-lr')();
const livereload = require('gulp-livereload');
module.exports = (gulp, $, config) => {
  let server;

  gulp.task('livereload', function() {
    livereload.reload();
  });

  gulp.task('start', function () {
    //server = gls.new(['./build/server/server.js']);
    //server.start();

    nodemon({ script: './build/server/server.js'
      , watch: ['./build/server']
      , tasks: [] })
      .on('restart', () => {
        setTimeout(() => {
          livereload.reload();
        }, 2000);
      });

    livereload.listen();

    gulp.watch([config.to.client.dev.js.all], ['verify:client', 'build:js:client', 'livereload']);
    //    jade
    //gulp.watch(config.to.client.dev.js.all, ['verify:server', 'build:js']);
    //    less
    gulp.watch([config.to.client.dev.css.all], ['build:css', 'livereload']);
    //    html
    gulp.watch([config.to.client.dev.html.all], ['build:html', 'livereload']);

    //  server
    //    js
    gulp.watch(config.to.server.dev.js.all, ['verify:server', 'build:js:server']);
  });
};
