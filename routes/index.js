var monk   = require('monk')
  , parse  = require('co-body')
  , render = require('../lib/views')
  , wrap   = require('co-monk')
  ;

// Initialize database connection
var db = monk('localhost/test');
var todos = wrap(db.get('todos'));

// Route definitions

/**
 * Item List.
 */
exports.list = function *() {
  var results = yield todos.find({});
  console.log(results);
  this.body = yield render('index', {todos: results});
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
  var result = yield todos.findById(id);
  if (!result) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('edit', {todo: result});
};

/**
 * Show details of a todo item.
 */
exports.show = function *(id) {
  var result = yield todos.findById(id);
  if (!result) {
    this.throw(404, 'invalid todo id');
  }
  this.body = yield render('show', {todo: result});
};

/**
 * Delete a todo item
 */
exports.remove = function *(id) {
  yield todos.remove({"_id": id});
  this.redirect('/');
};

/**
 * Create a todo item in the data store
 */
exports.create = function *() {
  var input = yield parse(this);
  console.log(input);
  var d = new Date();
  yield todos.insert({
    name: input.name,
    description: input.description,
    created_on: d,
    updated_on: d
  });
  this.redirect('/');
};

/**
 * Update an existing todo item.
 */
exports.update = function *() {
  var input = yield parse(this);
  console.log(input);
  yield todos.updateById(input.id, {
    name: input.name,
    description: input.description,
    updated_on: new Date()});
  this.redirect('/');
};

