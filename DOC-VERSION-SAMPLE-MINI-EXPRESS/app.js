'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
require("./src/common/passport")(passport);

var flash = require('connect-flash');
var routes = require('./routes/index');
var docs = require('./routes/docs');
var session = require('express-session');
var models = require("./src/models");
var User = require("./src/models/users");
var Docs = require("./src/models/docs");
var DocsVersion = require("./src/models/docsVersions");
var Q = require("q");
var app = express();
var http = require('http').Server(app);

var rolesInit = require('./src/config/rolesInit');
var userInit = require('./src/config/userInit');
var sideInit = require('./src/config/sideInit');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(session({ secret: 'xxx', name: 'ss_xxx', saveUninitialized: true, resave: true }));


app.use('/', routes);
app.use('/docs', docs);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

models.sequelize.sync({force:true}).then(function () {
    return Q.all([rolesInit(models), userInit(models), sideInit(models)]);
}).then(function (res) {
    var port = process.env.PORT || 1111;
    var server = app.listen(port, function () {
        console.log('Express server listening on port ' + server.address().port);
        debug('Express server listening on port ' + server.address().port);
    });

    var io = require("socket.io").listen(server);
    io.on("connection", function (socket) {
        socket.on('edit-word', function (content) {
            io.emit('edit-word', content);
        });
    });
})


