/*
 * 
200 - OK
201 - Created  # Response to successful POST or PUT
302 - Found # Temporary redirect such as to /login
303 - See Other # Redirect back to page after successful login
304 - Not Modified
400 - Bad Request
401 - Unauthorized  # Not logged in
403 - Forbidden  # Accessing another user's resource
404 - Not Found
500 - Internal Server Error
 */

// set up ========================
var util = require('util'),
    express = require('express'),
    database = require('./api/config/database'),
    expressValidator = require('express-validator'),
    User = require('./api/models/user'),
    app = express(),
    authService = require('./api/service/authService'),
    serverUtil = require('./api/util/serverUtil'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Connect to the DB
database.connectDb(database.mongoDbUrl);

// configuration =================
app.configure(function() {
    app.use(serverUtil.setHeaders);
    app.use(express.static(__dirname + '/public')); // set the static files
    // location /public/img will
    // be /img for users
    app.use(express.logger('dev')); // log every request to the console
    // These next two lines replace app.use(express.bodyParser());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(expressValidator([]));
    app.use(express.methodOverride()); // simulate DELETE and PUT
    app.use(express.cookieParser());
    // Expire in 15 minutes
    app.use(express.cookieSession({ key: 'mem.app', secret: 'p1ke5#P3ak', path: '/', httpOnly: true, maxAge: 900000 }));
    app.use(passport.initialize());
    app.use(passport.session());
    //app.use(express.csrf());
});

//Setup our authentication
//Passport uses the fields username and password by default, if those are
//not the names of the fields, then an object with the field names will need
//to be passed in here as the first paramter: { usernameField: 'email', passwordField: 'passwd'}
passport.use(new LocalStrategy({ usernameField: 'userName', passwordField: 'password'}, authService.authenticateUser));

passport.serializeUser(authService.serializeUser);
passport.deserializeUser(authService.deserializeUser);

// routes ======================================================================
require('./api/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(8081);
console.log("App listening on port 8081");