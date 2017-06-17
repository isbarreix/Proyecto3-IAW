var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Markers', new Schema({ 
	name: String, 
	lat: String, 
    lng: String,
    vicinity: String,
    description: String,
    rate: String
}));