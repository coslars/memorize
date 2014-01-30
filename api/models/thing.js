// the Thing object
var mongoose = require('mongoose');

module.exports = mongoose.model('Thing', {
    text : String,
    desc : String,
    usr : String,
    dateCompleted : Date
});