var serviceBase = {
        
    // Just a wrapper for logging
    printMe: function printMe(stringToLog) {
        
        if (stringToLog === undefined) {
            
            stringToLog = "logMe was passed an undefined string.";
        }
        
        console.log(stringToLog);
    }
};

module.exports = serviceBase;