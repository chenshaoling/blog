var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var settings = require('./settings');
var flash = require('connect-flash');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var multer = require('multer');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//save session data to mongodb
app.use(session({
	secret:settings.cookieSecret,
	key:settings.db,//cookie name
	cookie:{maxAge:1000 * 60 * 60 * 24 *30},//30 days
	store:new MongoStore({
		// db:settings.db,
		// host:settings.host,
		// port:settings.port
		url: 'mongodb://127.0.0.1/blog'
	})
}));
app.use(multer({
	dest:'./public/images',
	rename: function(fieldname, filename){
		return filename;
	}
}).any())
app.use(flash());
//app.use('/', index);
//app.use('/users', users);
index(app);

app.listen(app.get('port'),function(){
	console.log('port:'+app.get('port'))
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
