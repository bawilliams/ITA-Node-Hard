//HARD: Add the remaining CRUD functionality to your medium problem. 
// Make sure you return the proper HTTP status codes based on the outcome of the request. 
// Be sure to implement error checking here. 
// If an invalid request is made, we want to return some sort of error message and the 
// correct HTTP status code for the situation.
// HTTP Status Codes: http://www.restapitutorial.com/httpstatuscodes.html
 
// POST::myendpointname.com/employees  =  Inserts new employee into your data.
// GET::myendpointname.com/employees = Returns json with information from all employees.
// GET::myendpointname.com/employees/<employeeID>  =  Returns json with the information from that specific employee.
// PUT::myendpointname.com/employees/<employeeID>  =  Updates information for specified employee.
// DELETE::myendpointname.com/employees/<employeeID>  =  Removes the employee with that ID from the data.

const express = require('express');
const _ = require('lodash'); 
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser'); 

const {mongoose} = require('./db/mongoose');
const {Employee} = require('./models/employee');

// Create the express application
var app = express();
const port = process.env.PORT || 3000;

// Takes object and converts it to JSON, adding it on to the body; used for POST
app.use(bodyParser.json());

// POST Request to insert new employee
app.post('/employees', (req, res) => {
    var employee = new Employee({
        name: req.body.name,
        department: req.body.department,
        salary: req.body.salary
    });

    employee.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET Request to grab all employees data
app.get('/employees', (req, res) => {
    Employee.find().then((employees) => {
        res.send({employees});
    }).catch((e) => {
        res.status(404).send();
    });
});

// GET Request to grab employee data by ID
app.get('/employees/:id', (req, res) => {
    // grab the variable passed in as a parameter
    var id = req.params.id;

    // validate ID using ObjectID method isValid
    if (!ObjectID.isValid(id)) {
        // if invalid, stop function execution and respond with 404, send back empty body
        return res.status(404).send();
    }

    // Find employee by ID and handle errors if not found
    Employee.findById(id).then((employee) => {
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send({employee});
            
    }).catch((e) => {
        res.status(404).send();
    });
});

// DELETE Request using a specific employee's ID
app.delete('/employees/:id', (req, res) => {
    // get the id
    var id = req.params.id;

    // validate the id -> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // remove employee by id
    Employee.findByIdAndRemove(id).then((employee) => {
        // If employee not found, send 404
        if (!employee) {
            return res.status(404).send();
        }
        res.send({employee});
    }).catch((e) => {
        res.status(400).send();
    });    
});

// PUT Request using a specific employee's ID - updates the entire document
app.put('/employees/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['name','department','salary']); 
    // pick allows you to go through an object 
    // and pick off the properties set in the array

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // Set the body to the req body and show the new document
    Employee.findByIdAndUpdate(id, {$set: body}, {new: true}).then((employee) => {
        if (!employee) {
            return res.status(404).send();
        }
        res.send({employee});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};