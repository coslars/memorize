var serverUtil = require('../util/serverUtil'),
    serviceBase = require('./serviceBase'),
    Thing = require('../models/thing'),
    serviceFunctions = serverUtil.createObject(serviceBase);

// Find All method that will find everything that has been memorized.
serviceFunctions.findAll = function findAll(req, res) {

    // use mongoose to get all todos in the database
    Thing.find({ usr : serverUtil.getSessionUserName(req) }, function (err, things) {

        // If we didn't get an error return the thing to the caller
        serverUtil.checkErrorAndResJson(res, err, things);
    });
};

// Find a memorized thing by it's id.
serviceFunctions.findOne = function findOne(req, res) {

    Thing.findOne({
        _id: req.params.thing_id
    }, function (err, thing) {
        
        serverUtil.checkErrorAndResJson(res, err, thing);
    });
};

// Insert or Update a thing
serviceFunctions.saveOne = function saveOne(req, res) {

    // run through our validations
    var errors = serviceFunctions.validateThing(req);
    
    // If we had errors, send them back to the client.
    if (errors) {
        
        serverUtil.handleError(res, errors);
        
    } else {
        
        var postedThing = {
                text: req.body.text,
                desc: req.body.desc,
                usr: req.session.sessionObj.authUser.userName,
                dateCompleted: req.body.dateCompleted
            };

        if (req.body.id !== undefined) {

            // UPDATE
            Thing.findByIdAndUpdate(req.body.id, postedThing, function (err, savedThing) {

                // If we didn't get an error return the thing to the caller
                serverUtil.checkErrorAndResOk(res, err, savedThing);
            });

        } else {

            // INSERT
            Thing.create(postedThing, function (err, savedThing) {

                // If we didn't get an error return the thing to the caller
                serverUtil.checkErrorAndResOk(res, err, savedThing);
            });
        }
    }
};

// Used by the save function to validate the memorized thing.
serviceFunctions.validateThing = function validateThing(req) {
    
    req.assert('text', 'Text is required.').notEmpty();
    req.assert('desc', 'Description is required.').notEmpty();
    req.assert('dateCompleted', 'Date Completed is required.').notEmpty();
    
    return req.validationErrors();
};

// Delete a thing.
serviceFunctions.deleteOne = function deleteOne(req, res) {

    Thing.findByIdAndRemove(req.params.thing_id, function (err, removedThing) {

        // If we didn't get an error return the thing to the caller
        serverUtil.checkErrorAndResOk(res, err, removedThing);
    });
};
        
module.exports = serviceFunctions;