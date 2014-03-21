var render = require('../lib/views')
  , parse  = require('co-body')
  , Todo   = require('../models/todo')
  ;

// Route definitions

/**
 * Item List.
 */
exports.list = function *() {
  var todos = yield Todo.find({});
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
  var todo = yield Todo.findById(id);
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('edit', {todo: todo.toJSON()});
};

/**
 * Show details of a todo item.
 */
exports.show = function *(id) {
  var todo = yield Todo.findById(id);
  if (!todo) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('show', {todo: todo.toJSON()});
};

/**
 * Delete a todo item
 */
exports.remove = function *(id) {
  yield Todo.findByIdAndRemove(id);
  this.redirect('/');
};

/**
 * Create a todo item in the data store
 */
exports.create = function *() {
  var input = yield parse(this);
  var todo = new Todo();
  todo.name = input.name;
  todo.description = input.description;
  todo.created_on = new Date();
  todo.updated_on = new Date();
  yield todo.save();
  this.redirect('/');
};

/**
 * Update an existing todo item.
 */
exports.update = function *() {
  var input = yield parse(this);
  var todo = yield Todo.findById(input.id);
  todo.name = input.name;
  todo.description = input.description;
  todo.updated_on = new Date();
  yield todo.save();
  this.redirect('/');
};

