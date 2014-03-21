var mongoose = require('../lib/mongoose');

var TodoSchema = new mongoose.Schema({
    name:        {type: String}
  , description: {type: String}
  , created_on:  {type: Date, default: Date.now}
  , updated_on:  {type: Date, default: Date.now}
});

module.exports = mongoose.model('Todo', TodoSchema);
