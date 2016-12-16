var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Tutorial = require('../models/tutorial');
var User = require('../models/user');
var db=require('monk')('localhost/project');

var Category= require('../models/categorie');
var Mentor= require('../models/mentor');
router.get('/',function(req,res){
	User.find({},function(err,users){
	res.render('ban',{"title":"ban","id":req.user._id,"users":users})
})	
})
router.post('/',function(req,res){
var submit= req.body.submit;
var userb= req.body.userb;
var userrei=req.body.userrei

if(submit== "ban")
 {console.log(userb);
  User.findOneAndUpdate({"username":userb},{"banned":"true"},function(err,user){

  	console.log(user);
  	res.redirect('/ban');
  })
 }
 if(submit== "rei")
 {
  User.findOneAndUpdate({"username":userrei},{"banned":"false"},function(err,user){

  	console.log(user);
  	res.redirect('/ban');
  })
 }
})
module.exports = router;