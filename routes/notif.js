var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Mentor = require('../models/mentor');
var User = require('../models/user');
var Report = require('../models/report');

var db=require('monk')('localhost/project');

function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){
		res.redirect('/forum/'+req.user.id);
		
	}
	return next();

}
router.get('/:id',function(req,res,next){
	Mentor.find({"student_name":req.user.username},function(err,Notifications){
	Mentor.find({"mentor":req.user.username},function(err,notifications){
		Report.find({},function(err,reports){
res.render('notification',{"reports":reports,"user":req.user,'title':'notification','notifications':notifications,'Notifications':Notifications,"id":req.params.id});
});
	})
})
})
router.post('/:id',function(req,res,next){
	var idn=req.body.id;
	var submit = req.body.submit; 
	if(submit=='accept')
	{
	Mentor.findByIdAndUpdate(idn,{accepted:"true"},function(err,notif){
		
		User.findOne({"username":notif.student_name},function(err, student){
			student.numberOfNotification++;
			console.log(student);
			student.save();
		});
		User.findOne({"username":notif.mentor},function(err, mentor){
			mentor.numberOfNotification--;
			console.log(mentor);
			mentor.save();
		});
		res.redirect('/notif/'+req.params.id);
	});
}
	else if (submit = "twc")
	{
		Report.findByIdAndRemove(idr,function(err,report){
			res.redirect('/notif/'+req.params.id)
		})
	}
	
	else
	{
		Mentor.findByIdAndRemove(idn,function(err,notif){
		User.findOne({"username":req.user.username},function(err, mentor){
			mentor.numberOfNotification--;
			console.log(mentor);
			mentor.save();
		});
			res.redirect('/notif/'+req.params.id);
		});
	}
	
})
module.exports = router;