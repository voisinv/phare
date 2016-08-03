'use strict';

import gulp from 'gulp';

import source from 'vinyl-source-stream';

import path from 'path';

import jade from 'gulp-jade';


const $ = require('gulp-load-plugins')({
  // used for all plugins type not just with gulp-*
  pattern: '*'
});

// TASKS
// verirfy
require('./tasks/tasks-verify')(gulp, $, config);
//   verify:client
//   verify:server
// clean
require('./tasks/task-clean')(gulp, $, config);
// build
//   build
//     build:js
require('./tasks/tasks-js')(gulp, $, config);
//     build:html
require('./tasks/tasks-html')(gulp, $, config);
//     build:css
require('./tasks/tasks-less')(gulp, $, config);
//     build:client:assets
//   build:server
// serve
require('./tasks/task-serve')(gulp, $, config);
// watch
//   watch:client
//   watch:server
// test
//   test:client:unit
//   client:server:unit


gulp.task('serve', (cb) => {
  runSequence('verify', 'clean', 'build', 'watch', 'start');
});

import config from './tasks/config';
let runSequence = require('run-sequence').use(gulp);

gulp.task('styles', (cb) => {
  runSequence('less', cb);
});


gulp.task('build', (cb) => {
  runSequence(['build:html', 'build:js', 'build:css'], cb);
});

gulp.task('watch', () => {
  // client
  //    js


});


