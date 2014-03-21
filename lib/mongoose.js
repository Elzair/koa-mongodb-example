var mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost');

module.exports = mongoose;
