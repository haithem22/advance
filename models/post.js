var mongoose = require('mongoose');

 // User Schema
 var PostSchema = mongoose.Schema({
 	title: {
 		type: String,
 		index: true
 	}, 
 	category:{
 		type:String
 	},
 	body:{
 		type: String
 	},
 	bbody:{
 		type: String
 	},
 	author:{
 		type: String
 	},
 	
 });
 
 var Post = module.exports = mongoose.model('Post',PostSchema);
module.exports.createPost = function   (newPost,callback) {
 	newPost.save(callback);
 }

module.exports.modifyPost = function(newPost,callback) {
 	newPost.save(callback);
 }