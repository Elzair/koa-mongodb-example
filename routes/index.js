var parse  = require('co-body')
  , render = require('../lib/views')
  , todos  = require('../models/todos')
  ;


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
  console.log(JSON.stringify(result));
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
    created_on: new Date(input.created_on),
    updated_on: new Date()});
  this.redirect('/');
};

