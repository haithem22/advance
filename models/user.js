var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project');
var db = mongoose.connection;
 // User Schema
 var UserSchema = mongoose.Schema({
 	username: {
 		type: String,
 		index: true
 	}, 
 	password:{
 		type:String
 	},
 	name:{
 		type: String
 	},
 	email:{
 		type: String
 	},

 	speciality:
 	{
 		type: String
 	},
 	banned:
 	{
 		type:String,
 		default:"false"
 	},
 	numberOfNotification:
 	{
 		type:Number,
 		default:0
 	},
 	moderation:
 	[{
 		title:String
 	}
 	]

 });
 var User = module.exports = mongoose.model('User',UserSchema);
 module.exports.createUser = function   (newUser,callback) {
 	newUser.save(callback);
 	// body...
 }
 module.exports.getUserByUsername = function (username,password,callback)
 {
 	var query={username:username};
 	User.findOne(query,callback);
 }
 module.exports.getUserById = function (id,callback)
 {
 	
 	User.finByID(id,callback);}
 	
 