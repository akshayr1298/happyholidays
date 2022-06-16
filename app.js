var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var vendorRouter = require('./routes/vendor');
var hbs = require('express-handlebars') 
var fileUpload = require('express-fileupload')

var app = express();
var db = require('./database/connection')  // db route
var session = require('express-session')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({
  secret: 'secrertfalse',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}))

db.connect((err)=>{
  if(err)
  console.log("connection failed"+err);

  else
  console.log("database connected");

})
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/admin',adminRouter);
app.use('/vendor',vendorRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
