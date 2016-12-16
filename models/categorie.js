var mongoose = require('mongoose');


 // User Schema
 var CategorieSchema = mongoose.Schema({
 	title: {
 		type: String,
 		index: true
 	},
 	general: {
 		type: String,
 		index: true
 	},
 });
 
var Categorie = module.exports = mongoose.model('Categorie',CategorieSchema);
 
module.exports.createCategorie = function(newCategorie,callback){
 	newCategorie.save(callback);
}