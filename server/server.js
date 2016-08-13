var express = require('express');
var path = require('path');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');


var app = express();

var bodyParser = require('body-parser');
//var _ = require('lodash');

//var routes = require('./server/router');
//var users = require('./server/users');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());
//app.use(require('less-middleware')(path.join(__dirname, 'public')));
// error handlers@

// development error handler
// will print stacktrace
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/articles', (req, res) => {
  res.status(200).send({articles: ['one', 'two', 'three']});
});
app.listen(3000);
console.log('Listening on port 3000');
//app.use('/', routes);
//app.use('/users', users);
// production error handler


// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
