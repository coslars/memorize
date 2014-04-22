var util = {

    // From Douglas Crawford, this allows us to use to create new objects
    //  built on the passed in object.  Pass in an object, and it will create a new one with
    //  prototypal inherantance to the passed in object.  In other words, calling this function will
    //  return you a new object with all the properties/methods of the passed in object.
    createObject: function createObject(o) {

        'use strict';

        function F() {}
        F.prototype = o;
        return new F();
    },

    // This function allows us to not have try/catch blocks strewn through out the code
    //   This function will get called like execute(res, myFunc, myfuncArg0, myFuncArg1, myFuncArg2);
    //   We'll take the arguments that are passed after the function that was passed in and then
    //   apply them to the function
    execute: function execute(res, func) {

        'use strict';
        
        var funcName;

        try {
            
            // Get the name of the function 
            funcName = this.getFuncName(func);
            
            this.printMe("Entering Method: " + funcName);

            func.apply(null, this.pullOutArgumentsStartingWith(arguments, 1));

        } catch (err) {

            this.printMe("An ERROR occurred executing the function: " + funcName + ".  Error Details are: " + err);
            
            this.constructAndSendError(res, err);
            
        } finally {
            
            this.printMe("Exiting Method: " + funcName);
        }
    },
    
    // Pull out the function name, used for logging
    getFuncName: function getFundName(func) {
        
        var funcName;
        
        funcName = "function name not set";
        if ((func !== undefined && func.name !== undefined) && func.name !== "") {

            funcName = func.name;
        }
        
        return funcName;
    },
 
    // This method takes the arguments object that is available inside a function and strips
    //  out the arguments starting with the number passed in.  If you have four arguments
    //  and you pass in a start of 1 because it's zero based it will return arguments [2] - n
    pullOutArgumentsStartingWith: function pullOutArgumentsStartingWith(allArguments, startZeroBased) {

        'use strict';

        var modifiedArguments = [],
            x = 0,
            i = 0;

        // BUG BUG - We need a numeric check here...
        if (startZeroBased === undefined) {

            startZeroBased = 0;
        }

        for (i = 0; i < allArguments.length; i += 1) {

            if (i > startZeroBased) {

                modifiedArguments[x] = allArguments[i];
                x += 1;
            }
        }

        return modifiedArguments;
    },
    
    // We got an error object, now take that information and build a new object
    //  that the front end can understand
    constructAndSendError: function constructAndSendError(res, err) {

        'use strict';
        
        var errorObject = {
            message : err.message,
            stack : err.stack
        };

        return this.handleError(res, errorObject);
    },
    
    // Pass this function an html\object name and the error message
    //  and it will construct an object like the express validations object
    //  creates so the error will be shown correctly.
    constructAndSendFieldError: function constructAndSendFieldError(res, errorField, errorMsg) {

        'use strict';
        
        return this.handleError(res, [constructAndSendFieldError(errorField, errorMsg)]);
    },
    
    // Build the JSON object for this error
    constructAndFieldError: function constructAndFieldError(errorField, errorMsg) {

        'use strict';
        
        var errorObject = {
            param : errorField,
            msg : errorMsg
        };

        return errorObject;
    },    

    // This function should be called to handle all errors that are created on the server.
    //  It will take the error object or error array and package it up for the client.
    handleError: function handleError(res, errorThing) {

        'use strict';

        var isErrorOccurred = false;

        if (errorThing !== undefined && errorThing !== null) {

            res.json(errorThing, 400);
            isErrorOccurred = true;
        }

        return isErrorOccurred;
    },

    // This function should be called to handle all responses that include a JSON object
    handleJSON: function handleJSON(res, resJSON) {

        'use strict';
        
        res.json(resJSON, 200);
    },
    
    // This function should be called to handle all responses that have no issue.  We could have a string
    //  or the string could be empty
    handleOk: function handleOk(res, resString) {

        'use strict';
        
        if (resString === undefined) {
            
            resString = "";
        }
        
        res.json(resString, 200);
    },

    // This is a typical check post call to the db, check to see if we got an error
    //  and then respond
    checkErrorAndResJson: function checkErrorAndResJson(res, error, resJson) {

        'use strict';
        
        // If we didn't get an error return the thing to the caller
        if (!this.handleError(res, error)) {
            
            this.handleJSON(res, resJson);
        }
    },

    // This is a typical check post call to the db, check to see if we got an error
    //  and then respond    
    checkErrorAndResOk: function checkErrorAndResOk(res, error, resString) {

        'use strict';
        
        // If we didn't get an error return the thing to the caller
        if (!this.handleError(res, error)) {
            
            this.handleOk(res, resString);
        }
    },
    
    // Just a wrapper for logging
    printMe: function printMe(stringToLog) {
        
        if (stringToLog === undefined) {
            
            stringToLog = "logMe was passed an undefined string.";
        }
        
        console.log(stringToLog);
    },
    
    // Set the global headers here
    setHeaders: function setHeaders(req, res, next) {
        
    	'use strict';
    	
        res.setHeader("cache-control", "private, max-age=15");
        
        next();
    },
    
    // One place to get the user name
    getSessionUserName: function getSessionUserName(req) {
        
        'use strict';        
        
        console.log('getUserName: ' + req.session.sessionObj.authUser.userName);
        
        return req.session.sessionObj.authUser.userName;
    }
};

module.exports = util;