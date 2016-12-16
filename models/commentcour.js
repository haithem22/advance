var mongoose = require('mongoose');

 // User Schema
 var CommentcoursSchema = mongoose.Schema({
 	coment: {
 		type: String,
 		index: true
 	}, 
 	username:{
 		type:String
 	},
 	cours:{
 		type: String
 	}
 });
 var Commentcours = module.exports = mongoose.model('Commentcours',CommentcoursSchema);
 module.exports.createCommentcours = function   (newCommentcours,callback) {
 	newCommentcours.save(callback);
 }