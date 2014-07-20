var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var users = require('./routes/users');
var db = require('./mongo.js');

var app = express();

db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use('/', function(req, res) {
	db.findOneUser({username:"admin"}, function(item) {
		console.log(item);
	});
	res.render('index', { title: 'Express' });
});
*/
app.use('/users', users);

app.get('/login', function(req, res) {
	res.render('login', {title:'LOGIN'});
});

app.post('/login', function(req, res) {
	res.render('index', {title:'INDEX'});
});

app.get('/add', function(req, res) {
    res.render('add', {title:'POST'});
});

//app.post()...
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
http.createServer(app).listen(8000,
		function() { console.log('Server Started'); });
