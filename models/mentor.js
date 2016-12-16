var mongoose = require('mongoose');

 // User Schema
 var MentorSchema = mongoose.Schema({
 	student_name: {
 		type: String,
 		index: true
 	}, 
 	field:{
 		type:String
 	},
 	mentor:{
 		type: String
 	},
 	accepted:{
 		type:String
 	}
 });
 var Mentor = module.exports = mongoose.model('Mentor',MentorSchema);
 module.exports.createMentor = function   (newMentor,callback) {
 	newMentor.save(callback);
 }