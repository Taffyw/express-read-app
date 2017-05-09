//RESTFUL风格的代码练习
var express = require('express');
var path = require('path');
//w网页名称左边的图标
var favicon = require('serve-favicon');
//控制台打印信息
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//解析JOSN  url
var bodyParser = require('body-parser');
// var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));

// app.use(session({
//   secret: 'itcast-secret',
//   name :'itcast-name',
//   cookie: {maxAge: 8000000000},
//   resave : false,
//   saveUninitialized: true,
// }));

app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/user', users);








// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;