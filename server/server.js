var express = require('express');
var path = require('path');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
const articles = require('./utils/articles.js');
var app = express();

var bodyParser = require('body-parser');

//var users = require('./server/users');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../client')));
app.get('/api/get/:base', function(req, res) {
  articles.retrieve(req.params, res);
});
app.get('/api/articles', (req, res) => {
  articles.get(req.query, res);
});
app.get('*', (req, res) => {
  res.send(null, 404);
});

app.listen(3000);

console.log('Listening on port 3000');

app.use(function(err, req, res) {
  res.send(null, err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
