// load the thing model
var serverUtil = require('./util/serverUtil'),
    thingService = require('./service/thingService'),
    userService = require('./service/userService'),
    authService = require('./service/authService'),
    passport = require('passport');

/*
for (var prop in thingService) {

    // important check that this is objects own property 
    // not from prototype prop inherited
    if (thingService.hasOwnProperty(prop)) {
        console.log("We are in the loop");
        console.log(prop + " = " + thingService[prop]);
    }
}
*/
module.exports = function (app) {
    
    'use strict';
    
    /*
     * END MEMORIZE ROUTES 
     */

    /*
     * START AUTHENTICATION
     */

    // Login to the app, leave this URL open
    app.post('/api/login', authService.validateLogin, passport.authenticate('local', {
        successRedirect: '/api/login/success',
        failureRedirect: '/api/login/failure'
    }));
    
    // We have successfully logged in.
    app.get('/api/login/success', authService.verifyAuthentication, function (req, res, next) {
        
        serverUtil.execute(res, authService.successfulAuthentication, req, res, next);
    });

    // The user failed to login, leave this URL open
    app.get('/api/login/failure', function (req, res, next) {
        
        serverUtil.execute(res, authService.failedAuthentication, req, res, next);
    });
    
    /*
     * END AUTHENTICATION
     */
    
    /*
     * START MEMORIZE ROUTES 
     */

    // Get all the things that have been memorized.
    app.get('/api/thing', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, thingService.findAll, req, res);
    });

    // Find a Thing by its id
    app.get('/api/thing/:thing_id', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, thingService.findOne, req, res);
    });

    // Insert or update a thing.
    app.post('/api/thing', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, thingService.saveOne, req, res);
    });
    
    // Delete one thing by its id.
    app.delete('/api/thing/:thing_id', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, thingService.deleteOne, req, res);
    });
    
    /*
     * END MEMORIZE ROUTES 
     */

    /*
     * START USER ROUTES 
     */

    // Get all the things that have been memorized.
    app.get('/api/user', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, userService.findAll, req, res);
    });

    // Find a Thing by its id
    app.get('/api/user/:user_id', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, userService.findOne, req, res);
    });

    // Insert or update a thing.
    app.post('/api/user', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, userService.saveOne, req, res);
    });
    
    // Delete one thing by its id.
    app.delete('/api/user/:user_id', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, userService.deleteOne, req, res);
    });
    
    /*
     * END USER ROUTES 
     */
    
    
    //app.get('/api/memorize/verseLookup/:passage', bibleService.queryPassage);
    
    // Get the 
    app.get('/api/util/getSession', authService.verifyAuthentication, function (req, res) {
        
        serverUtil.execute(res, authService.getSessionObjectFromSession, req, res);
    });    
       
    // The login URL, leave it open
    app.get('/login', function (req, res) {

        res.sendfile('./public/whole.html');
    });
    
    // Log the user out of the application
    app.get('/logout', function (req, res) {
    
        req.logout();
        res.redirect('/login');
    });
    
    // Any URL that is not handled above will be handled by the client via Angular
    app.get('*', authService.verifyAuthentication, function (req, res) {

        res.sendfile('./public/whole.html');
    });
};