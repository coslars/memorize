var serverUtil = require('../util/serverUtil'),
    serviceBase = require('./serviceBase'),
    https = require('https'),
    serviceFunctions = serverUtil.createObject(serviceBase);

/**
 * Clean out the HTML and carriage returns
 * @param text
 */
serviceFunctions.cleanOutHtml = function cleanOutHtml(text) {
    
    var start = text.indexOf(">"),
        end,
        sliced,
        cleaned = "",
        aryPos = 0;
    
    while (start !== -1) {
        
        end = text.indexOf("<", start);
        
        if (end !== -1) {
         
            sliced = text.slice(start + 1, end);
            
            if ((sliced !== undefined && sliced !== "")) {
                
                cleaned += sliced;
            }
            
            start = text.indexOf(">", end);
            
        } else {
            
            break;
        }
    }

    cleaned = cleaned.replace(new RegExp("\r", "g"), '');
    cleaned = cleaned.replace(new RegExp("\n", "g"), '');

    return cleaned;
};

/**
 * Query a specific passage from the bible
 */
serviceFunctions.queryPassage = function queryPassage(req, res) {

    var token = 'o72foykzm0SdJ1aAdczI2LqP0ktHW3T8s4Bys8vx',
        baseUrl = 'bibles.org',
        bibleVersion = 'eng-ESV',
        passageQuery = '?q[]=' + req.params.passage.toLowerCase(),
        path = 'https://bibles.org/v2/' + bibleVersion + '/passages.js' + passageQuery,
        returnedPassage = '',
        requestOptions,
        httpsRequest;

    // Example
    // https://bibles.org/v2/passages.js?q[]=john+3:1-5&version=eng-KJVA
    // https://bibles.org/v2/passages.js?q[]=john+3:1-5&version=eng-KJVA
    // https://bibles.org/v2/passages.js?q[]=john+3:16&version=eng-NIV

    // The property 'auth': [user]:[password]',
    requestOptions = {
        'hostname': baseUrl,
        'path': path,
        'auth': token + ':X',
        'method': 'GET'
    };

    // Make the request to the REST service
    httpsRequest = https.request(requestOptions, function (httpsResponse) {

        var responseData = '';
        httpsResponse.setEncoding('utf8');

        // Build out the data from the response
        httpsResponse.on('data', function (chunk) {

            responseData += chunk;
        });

        // Parse it, it's json then return it to the caller
        httpsResponse.on('end', function () {

            var jsonObject,
                passages;
                        
            if (responseData !== undefined && responseData !== "") {
                
                jsonObject = JSON.parse(responseData);
                
                if (jsonObject !== undefined && jsonObject !== "") {
            
                    passages = jsonObject.response.search.result.passages;
                    
                    if (passages !== undefined) {

                        if (passages.length > 0) {

                            returnedPassage = serviceFunctions.cleanOutHtml(passages[0].text);
                        }
                    }
                }
            }

            // Send the response back to the caller.
            res.send(returnedPassage);
        });
    });

    // If we had an error log it.
    httpsRequest.on('error', function (e) {

        console.log('problem with request: ' + e.message);
    });

    httpsRequest.end();
};

serviceFunctions.queryBooks = function queryBooks(req, res) {

    var token = 'o72foykzm0SdJ1aAdczI2LqP0ktHW3T8s4Bys8vx',
        baseUrl = 'bibles.org',
        path = 'https://bibles.org/v2/versions/eng-ESV/books.js',
        returnedPassage = '',
        requestOptions,
        httpsRequest;

    // Example
    // https://bibles.org/v2/versions/eng-ESV/books.js

    // The property 'auth': [user]:[password]',
    requestOptions = {
        'hostname': baseUrl,
        'path': path,
        'auth': token + ':X',
        'method': 'GET'
    };

    // Make the request to the REST service
    httpsRequest = https.request(requestOptions, function (httpsResponse) {

        var responseData = '';
        httpsResponse.setEncoding('utf8');

        // Build out the data from the response
        httpsResponse.on('data', function (chunk) {
            
            responseData += chunk;
        });

        // Parse it, it's json then return it to the caller
        httpsResponse.on('end', function () {

            var jsonObject = JSON.parse(responseData);

            // Send the response back to the caller.
            res.send(jsonObject.response.books);
        });
    });

    // If we had an error log it.
    httpsRequest.on('error', function (e) {

        console.log('problem with request: ' + e.message);
    });

    httpsRequest.end();
};

module.exports = serviceFunctions;