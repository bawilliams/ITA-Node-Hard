var mongoose = require('mongoose');

// Create model with schema for employee
var Employee = mongoose.model('Employee', {
    name: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    department: {
        type: String,
        required: true,
        minlegth: 1,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        minlegth: 1,
        trim: true
    },
});

module.exports = {Employee};
