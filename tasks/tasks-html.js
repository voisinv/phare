const ngHtml2Js = require('gulp-ng-templates');

module.exports = (gulp, $, config) => {
  gulp.task('build:html', ['templates'], () => {
    return gulp.src(config.to.client.dev.html.main)
      // prevent breaking errors
      .pipe($.plumber())
      // beautify HTML
      .pipe($.prettify())/*
      .pipe($.inject(gulp.src(['app.min.js'], {
        read: false,
        relative: true
      })))*/
      .pipe(gulp.dest(config.to.build.directory.client));
  });
  // Set in cache templates of directive
  gulp.task('templates', function () {
    return gulp.src('client/js/*.tpl.jade')
      .pipe($.jade())
      .pipe(ngHtml2Js({
        filename: 'templates.js',
        module: 'templates',
        path: function (path, base) {
          return path.replace(base, '').replace('/templates', '');
        }
      }))
      .pipe(gulp.dest('build/client/templates'));
  });

};
