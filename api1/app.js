var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('./middlewares/myCors'));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const verifyAuth = require('./middlewares/verifyAuth');
app.use('/point', verifyAuth, require('./routes/point'));

module.exports = app;
