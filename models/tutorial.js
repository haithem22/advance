var mongoose = require('mongoose');

 // User Schema
 var TutorialSchema = mongoose.Schema({
 	title: {
 		type: String,
 		index: true
 	}, 
 	description:{
 		type:String
 	},
 	instructor:{
 		type: String
 	},
 	instructorId:{
 		type:String
 	},
 	lessons:[{
 		lesson_number:{type:String },
 		lesson_title:{type:String},

 		lesson_body:{type:String},
 		lesson_video:{type:String}

 		
 	}]
 	
 });
 var Tutorial = module.exports = mongoose.model('Tutorial',TutorialSchema);
 module.exports.createTutorial = function   (newTutorial,callback) {
 	newTutorial.save(callback);
 }
