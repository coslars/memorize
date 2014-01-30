// the User object
var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    firstName : String,
    lastName : String,
    userName : String,
    password : String
});