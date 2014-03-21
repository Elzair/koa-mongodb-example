var monk = require('monk')
  ;
// Initialize database connection
//var db = monk('localhost/test');
//var todos = wrap(db.get('todos'));

module.exports = monk('localhost/test');
