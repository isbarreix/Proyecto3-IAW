var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Admin', new Schema({ 
	name: String, 
	password: String
}));