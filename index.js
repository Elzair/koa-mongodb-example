var http     = require('http')
  , koa      = require('koa')
  , logger   = require('koa-logger')
  , route    = require('koa-route')
  , routes   = require('./routes')
  , serve    = require('koa-static')
  , stylus   = require('koa-stylus')
  ;

// Create koa app
var app = koa();

// middleware
app.use(logger());
app.use(stylus('./public'));
app.use(serve('./public'));

// Route middleware
app.use(route.get('/', routes.list));
app.use(route.get('/todo/new', routes.add));
app.use(route.get('/todo/:id', routes.show));
app.use(route.get('/todo/delete/:id', routes.remove));
app.use(route.get('/todo/edit/:id', routes.edit));
app.use(route.post('/todo/create', routes.create));
app.use(route.post('/todo/update', routes.update));

// Create HTTP Server
http.createServer(app.callback()).listen(3000);
console.log('Server listening on port 3000');
