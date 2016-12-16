var mongoose = require('mongoose');

 // User Schema
 var ReportSchema = mongoose.Schema({
 	username: {
 		type: String,
 		index: true
 	}, 
 	content:{
 		type:String
 	},
 	type:{
 		type: String
 	},
 	id:{
 		type:String
 	}
 });
 var Report = module.exports = mongoose.model('Report',ReportSchema);
 module.exports.createReport = function   (newReport,callback) {
 	newReport.save(callback);
 }