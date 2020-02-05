var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Standard: import user here
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pageview = require('./routes/pageview');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Standard: define routing here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pageview', pageview);

module.exports = app;
