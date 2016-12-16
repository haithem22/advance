var mongoose = require('mongoose');

 // User Schema
 var CommentSchema = mongoose.Schema({
 	coment: {
 		type: String,
 		index: true
 	}, 
 	username:{
 		type:String
 	},
 	post:{
 		type: String
 	}
 });
 var Comment = module.exports = mongoose.model('Comment',CommentSchema);
 module.exports.createComment = function   (newComment,callback) {
 	newComment.save(callback);
 }