var serverUtil = require('../util/serverUtil'),
    serviceBase = require('./serviceBase'),
    User = require('../models/user'),
    authService = require('./authService'),
    serviceFunctions = serverUtil.createObject(serviceBase);

// Find All method that will find every user that has been memorized.
serviceFunctions.findAll = function findAll(req, res) {

    // use mongoose to get all users in the database
    User.find(function (err, users) {

        // If we didn't get an error return the user to the caller
        serverUtil.checkErrorAndResJson(res, err, users);
    });
};

// Find a user by it's id.
serviceFunctions.findOne = function findOne(req, res) {

    User.findOne({
        _id: req.params.user_id
        
    }, function (err, user) {
        
        // Don't send the password
        user.password = undefined;
        
        serverUtil.checkErrorAndResJson(res, err, user);
    });
};

// Insert or Update a user
serviceFunctions.saveOne = function saveOne(req, res) {

    var postedUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password
    };
    
    // run through our validations
    serviceFunctions.validateUser(req, postedUser, function (errors, dbUser) {
        
        // If we had errors, send them back to the client.
        if (errors) {
            
            serverUtil.handleError(res, errors);
            
        } else {
            
            // Figure out if we need to encrypt the password before we save.
            postedUser = serviceFunctions.handlePasswordEncrption(req, postedUser, dbUser);

            if (req.body.id !== undefined) {
                
                // UPDATE
                User.findByIdAndUpdate(req.body.id, postedUser, function (err, savedUser) {

                    // If we didn't get an error return the user to the caller
                    serverUtil.checkErrorAndResOk(res, err, savedUser);
                });

            } else {
                      
                // INSERT
                User.create(postedUser, function (err, savedUser) {

                    // If we didn't get an error return the user to the caller
                    serverUtil.checkErrorAndResOk(res, err, savedUser);
                });
            }
        }
    });
};

// Figure out whether or not we need to encrypt the password before it's stored.
serviceFunctions.handlePasswordEncrption = function handlePasswordEncrption(req, postedUser, dbUser) {

    if (postedUser.password !== undefined && postedUser.password.length) {
        
        // They maybe reset the password, so take that.
        postedUser.password = authService.encryptString(postedUser.password);
        
    } else {
        
        // Take the password from the db
        postedUser.password = dbUser.password;
    }
    
    return postedUser;
};

// Used by the save function to validate the memorized user.
serviceFunctions.validateUser = function validateUser(req, postedUser, callMeBack) {
    
    req.assert('firstName', 'First Name is required.').notEmpty();
    req.assert('lastName', 'Last Name is required.').notEmpty();
    req.assert('userName', 'User Name is required.').notEmpty();
    
    // If they are updating we won't make them enter the password.
    if (req.body.id === undefined) {
    
        req.assert('password', 'Password is required.').notEmpty();
    }
    
    // Make sure the user name is unique before we save
    User.findOne({
        
        userName: postedUser.userName
        
    }, function (err, user) {
        
        // Make sure this user is unique
        if (user && (req.body.id === undefined || req.body.id !== user._id.toString())) {
                          
            req.validationErrors().push(serverUtil.constructAndFieldError("userName", "The User Name '" + postedUser.userName + "' already exists."));
        }
        
        callMeBack(req.validationErrors(), user);
    });
};

// Delete a user.
serviceFunctions.deleteOne = function deleteOne(req, res) {

    User.findByIdAndRemove(req.params.user_id, function (err, removedUser) {

        // If we didn't get an error return the user to the caller
        serverUtil.checkErrorAndResOk(res, err, removedUser);
    });
};
        
module.exports = serviceFunctions;