var render = require('../lib/views')
  , parse  = require('co-body')
  ;

// Route definitions

/**
 * Item List.
 */
exports.list = function *() {
  this.body = yield render('index', {todos: todos});
};

/**
 * Form for creating new todo item.
 */
exports.add = function *() {
  this.body = yield render('new');
};

/**
 * Form for editing a todo item.
 */
exports.edit = function *(id) {
  var todo = todos[id];
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('edit', {todo: todo});
};

/**
 * Show details of a todo item.
 */
exports.show = function *(id) {
  var todo = todos[id];
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('show', {todo: todo});
};

/**
 * Delete a todo item
 */
exports.remove = function *(id) {
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
};

/**
 * Create a todo item in the data store
 */
exports.create = function *() {
  var todo = yield parse(this);
  todo.created_on = new Date();
  todo.updated_on = new Date();
  var id = todos.push(todo);
  todo.id = id-1; // id with index of the array
  this.redirect('/');
};

/**
 * Update an existing todo item.
 */
exports.update = function *() {
  var todo = yield parse(this);
  var index = todo.id;
  todos[index].name = todo.name;
  todos[index].description = todo.description;
  todos[index].updated_on = new Date();
  this.redirect('/');
};

