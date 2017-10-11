var mongoose = require('mongoose');

// Set up our Mongoose DB to use promises
mongoose.Promise = global.Promise;

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/EmployeeApp');

module.exports = {mongoose};

// command line: 
// cd mongo/bin
// ./mongod --dbpath ~/mongo-data
