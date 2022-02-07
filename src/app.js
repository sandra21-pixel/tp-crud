const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const methodOverride =  require('method-override'); 

const app = express();

// **** Middlewares  ****
app.use(express.static(path.join(__dirname, '../public')));  
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method')); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); 


// **** Route System require and use() ****
const mainRouter = require('./routes/main'); 
const productsRouter = require('./routes/products'); 

app.use('/', mainRouter);
app.use('/products', productsRouter);

// **** catch 404 ****
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
  
  res.locals.message = err.message;
  res.locals.path = req.path;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // error page
  res.status(err.status || 500);
  res.render('error');
});


 module.exports = app;
