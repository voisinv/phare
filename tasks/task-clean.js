const del = require('del');

module.exports = (gulp) => {

  gulp.task('clean', () => del.sync(['./build']));

};


