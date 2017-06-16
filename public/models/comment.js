var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Comments', new Schema({ 
	name: String, 
	comment: String, 
    id_marker: String
}));