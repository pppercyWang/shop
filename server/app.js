var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var ejs = require('ejs')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));//定义模板（views ）搜索路径，在根目录的 views 文件夹下,可自定义
app.engine('.html',ejs.__express)//设置模板引擎 为： EJS, 可自定义
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//一定要注意拦截器放置的位置，中间件的后面，一级路由的前面
app.use(function(req,res,next){
  if(req.cookies.userId){
    next()
  }else{
    //originalUrl是原路径，包括参数，login和logout都是post请求，所有url里面不带参数
    //所以如果要请求goods/list的话就不能用req.originalUrl == '/goods/list',因为这是个get请求，携带了page,pagesize,sort参数
    //但也可以用req.originalUrl.indexOf('/goods/list')>-1,判断里面有没有
    //path则不管参数，只管路径地址
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path=='/goods/list'){ //设置白名单
      next()
    }else{
      res.json({
        status:'10001',
        msg:'未登录，不可进行此操作 username:admin pwd:123456',
        result:''
      })
    }
  }
})
//这里对应的是一级路由，而routes文件夹则是二级路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods',goodsRouter);
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
