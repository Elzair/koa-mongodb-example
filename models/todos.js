var db = require('../lib/db')
  , wrap = require('co-monk')
  ;

module.exports = wrap(db.get('todos'));
