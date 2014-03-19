var http   = require('http')
  , koa    = require('koa')
  , logger = require('koa-logger')
  , parse  = require('co-body')
  , route  = require('koa-route')
  , serve  = require('koa-static')
  , stylus = require('koa-stylus')
  , views  = require('co-views')
  ;

// Create koa app
var app = koa();

// "data store"
var todos = []; //Note: DB change to MongoDB

// middleware
app.use(logger());
app.use(stylus('./public'));
app.use(serve('./public'));

// Route middleware
app.use(route.get('/', list));
app.use(route.get('/todo/new', add));
app.use(route.get('/todo/:id', show));
app.use(route.get('/todo/delete/:id', remove));
app.use(route.get('/todo/edit/:id', edit));
app.use(route.post('/todo/create', create));
app.use(route.post('/todo/update', update));

// Specify Swig view engine
var render = views(__dirname + '/views', {map: {html: 'swig'}});

// Route definitions

/**
 * Item List.
 */
function *list() {
  this.body = yield render('index', {todos: todos});
}

/**
 * Form for creating new todo item.
 */
function *add() {
  this.body =yield render('new');
}

/**
 * Form for editing a todo item.
 */
function *edit(id) {
  var todo = todos[id];
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('edit', {todo: todo});
}

/**
 * Show details of a todo item.
 */
function *show(id) {
  var todo = todos[id];
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('show', {todo: todo});
}

/**
 * Delete a todo item
 */
function *remove(id) {
  var todo = todos[id];
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  todos.splice(id, 1);
  // Changing the id for working with index
  var i = 0;
  for (i=0; i<todos.length; i++) {
    todos[i].id = i;
  }
  this.redirect('/');
}

/**
 * Create a todo item in the data store
 */
function *create() {
  var todo = yield parse(this);
  todo.created_on = new Date;
  todo.updated_on = new Date;
  var id = todos.push(todo);
  todo.id = id-1; // id with index of the array
  this.redirect('/');
}

/**
 * Update an existing todo item.
 */
function *update() {
  var todo = yield parse(this);
  var index = todo.id;
  todos[index].name = todo.name;
  todos[index].description = todo.description;
  todos[index].updated_on = new Date;
  this.redirect('/');
}

// Create HTTP Server
http.createServer(app.callback()).listen(3000);
console.log('Server listening on port 3000');
