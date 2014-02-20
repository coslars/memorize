var serverUtil = require('../util/serverUtil'),
    serviceBase = require('./serviceBase'),
    User = require('../models/user'),
    passport = require('passport'),
    crypto = require('crypto'),
    serviceFunctions = serverUtil.createObject(serviceBase);

// Function used by passport to authenticate the user
serviceFunctions.authenticateUser = function authenticateUser(username, password, done) {

    User.findOne({ userName: username }, function (err, user) {
        
        if (err)
        {
           return done(err);
        }
    
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        
        if (!serviceFunctions.validPassword(user, password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        // Clear out the password
        user.password = undefined;
        
        return done(null, user);
    });
};

//Used by the save function to validate the memorized thing.
serviceFunctions.validateLogin = function validateLogin(req, res, next) {
    
    req.assert('userName', 'User Name is required.').notEmpty();
    req.assert('password', 'Password is required.').notEmpty();
    
    var errors = req.validationErrors();
    
    if (errors) {
        
        serverUtil.handleError(res, errors);
        
    } else {
        
        req.logout();
        next();
    }
};

// Make sure the password matches
serviceFunctions.validPassword = function validPassword(user, password){       
    
    if (serviceFunctions.decryptString(user.password) === password) {
        
        return true;
    }

    return false;
};

// Function needed by Passport to serialize the user in and out of the session 
serviceFunctions.serializeUser = function serializeUser(user, done) {
    done(null, user.id);
};

// Function needed by Passport to deserialize the user in and out of the session
serviceFunctions.deserializeUser = function deserializeUser(id, done) {
    
    User.findById(id, function(err, user) {
        done(err, user);
    });
};

// We have successfully logged in.
serviceFunctions.successfulAuthentication = function successfulAuthentication(req, res, next) {
    
    // Add stuff as we need to the session
    // Stick it up there
    req.session.sessionObj = serviceFunctions.createSessionObject(req);
    
    serverUtil.handleJSON(res, req.session.sessionObj);
};

// Create one object with everything we need on it for the session.
serviceFunctions.createSessionObject = function createSessionObject(req) {
    
    // Add stuff as we need to the session
    var sessionObj = {};
    sessionObj.authUser = req.user;
    sessionObj.dateFormat = 'dd-MMM-yyyy';
    
    return sessionObj;
};

// We have failed to login.
serviceFunctions.failedAuthentication = function failedAuthentication(req, res, next) {
    
    serverUtil.handleError(res, "The login failed for this user.");
};

// Pull the application session object from the session and return it to the caller
serviceFunctions.getSessionObjectFromSession = function getSessionObjectFromSession(req, res) {
    
    return serverUtil.checkErrorAndResJson(res, undefined, req.session.sessionObj);
};

// This method should be called on each route to make sure the user is authenticated.
serviceFunctions.verifyAuthentication = function verifyAuthentication(req, res, next) {
    
    if (req.isAuthenticated()) {
        
        next();
        
    } else {
        
        res.redirect("/login");
    }
};

// Encrypt/Decrypt algorithm
serviceFunctions.algorithm = "aes256";
// Password
serviceFunctions.key = "p1ke5#P3ak";

// Encrypt the passed in string
serviceFunctions.encryptString = function encryptString(stringtoEncrypt) {
   
    var cipher = crypto.createCipher(serviceFunctions.algorithm, serviceFunctions.key);
    
    return cipher.update(stringtoEncrypt, 'utf8', 'hex') + cipher.final('hex');
};

// Decrypt the passed in string
serviceFunctions.decryptString = function decryptString(stringtoDecrypt) {
    
    var decipher = crypto.createDecipher(serviceFunctions.algorithm, serviceFunctions.key);
    
    return decipher.update(stringtoDecrypt, 'hex', 'utf8') + decipher.final('utf8');
};
        
module.exports = serviceFunctions;