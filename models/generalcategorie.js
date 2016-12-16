var mongoose = require('mongoose');


 // User Schema
 var GeneralCategorieSchema = mongoose.Schema({
 	title: {
 		type: String,
 		index: true
 	},
 	moderator: {
 		type: String,
 		index: true
 	},
 });
 
var GeneralCategorie = module.exports = mongoose.model('GeneralCategorie',GeneralCategorieSchema);
 
module.exports.createGeneralCategorie = function(newGeneralCategorie,callback){
 	newGeneralCategorie.save(callback);
}