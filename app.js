var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('express-session');
var users = require('./routes/users');
var db = require('./mongo.js');
var moment = require('moment');
var crypto = require('crypto');
var conf = {
    salt: 'salt'
}
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
app.use(session({secret: 'secret'}));
app.locals.moment = moment
/*
app.use('/', function(req, res) {
	db.findOneUser({username:"admin"}, function(item) {
		console.log(item);
	});
	res.render('index', { title: 'Express' });
});
*/

app.use(function(req, res, next) {
    if(req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        if(req.originalUrl != '/login') {
            res.redirect('/');
        }
        next();
    }
});

app.get('/', function(req, res) {
    var fields = {
        subjedct: 1,
        body: 1,
        createdDate: 1,
        author: 1
    };
    db.findPost({state: 'published'}, function(err, posts) {
        if(!err && posts) {
            res.render('index', {title:'INDEX', postList:posts});
            }
    });
});
app.use('/users', users);

app.get('/login', function(req, res) {
	res.render('login', {title:'LOGIN'});
});

app.post('/login', function(req, res) {
    var query = { 
        username: req.body.username,
        password: crypto.createHash('sha256').update(req.body.password
            + conf.salt).digest('hex'),
    }
    if(req.body.login) {
        db.findOneUser(query, function(err, user) {
            if(err || !user) {
                res.render('login', {title: 'LOGIN', 
                    error: 'Nor user or wrong password'});
            } else {
                req.session.user = req.body.username;
                res.redirect('/');
            }
        });
    } else {
        db.joinUser(query, function(err, user) {
            if(err || !user) {
                console.log('err :' + JSON.stringify(err));
                console.log('user :' + JSON.stringify(user));
                res.render('login', {title: 'LOGIN', 
                    error: 'Cannot make new user'});
            } else {
                res.render('/login', {title:'LOGIN', error:'OK'});
            }
        });
    }
});

app.get('/post/add', function(req, res) {
    res.render('add', {title:'POST'});
});

app.post('/post/add', function(req, res) {
    var values = {
        subject: req.body.subject,
        body: req.body.body,
        state: 'published',
        createdDate: new Date(),
        updatedDate: new Date(),
        comments: [],
        author: {
            username: req.session.user
        }
    };

    db.addpost(values, function(err, post) {
        console.log(err, post);
        res.redirect('/');
    });
});

app.get('/post/:postid', function(req, res) {
    res.render('show', {
        title:'Showing Post - ' + req.post.subject, 
        post : req.post});
});

app.get('/logout', function(req, res) {
    res.session.destroy();
    res.redirect('/login');
});

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
