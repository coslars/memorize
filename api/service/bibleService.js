var serverUtil = require('../util/serverUtil'),
    serviceBase = require('./serviceBase'),
    Thing = require('../models/thing'),
    https = require('https'),
    serviceFunctions = {};

serviceFunctions.queryPassage = function (req, res) {

    var token = 'o72foykzm0SdJ1aAdczI2LqP0ktHW3T8s4Bys8vx',
        baseUrl = 'bibles.org',
        path = '/v2/passages.js',
        bibleVersion = 'version=eng-NIV',
        passageQuery = 'q[]=' + req.params.passage,
        returnedPassage = '',
        requestOptions,
        httpsRequest;

    path += '?' + passageQuery;
    path += '&' + bibleVersion;

    console.log('Passage: ' + req.params.passage);
    console.log('Going to: ' + baseUrl + path);

    // Example
    // https://bibles.org/v2/passages.js?q[]=john+3:1-5&version=eng-KJVA
    // https://bibles.org/v2/passages.js?q[]=john+3:1-5&version=eng-KJVA
    // https://bibles.org/v2/passages.js?q[]=john+3:16&version=eng-NIV

    // The property 'auth': [user]:[password]',
    requestOptions = {
        'hostname': baseUrl,
        'path': path,
        'auth': token + ':X',
        'method': 'get'
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

            var jsonObject = JSON.parse(responseData),
                passages = jsonObject.response.search.result.passages;

            if (passages !== undefined) {

                if (passages.length > 0) {

                    returnedPassage = passages[0].text;
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