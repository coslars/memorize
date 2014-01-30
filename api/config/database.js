// Pull in our modules
var mongoose = require('mongoose');

// Connect to the database
var connectDb = function(url) {

    // database connection
    mongoose.connect(url); // connect to mongoDB database on modulus.io

    // Make sure we have a valid database
    mongoose.connection.on('error', console.error.bind(console,
            'connection error:'));
};

module.exports.mongoDbUrl = 'mongodb://memorizeAppUser:Manager1@ds027729.mongolab.com:27729/memorize';

// MongoLab URL: mongodb://memorizeAppUser:Manager1@ds027729.mongolab.com:27729/memorize
// Local Machine URL: mongodb://memorizeAppUser:Manager1@localhost:27017/memorize

module.exports.connectDb = connectDb;