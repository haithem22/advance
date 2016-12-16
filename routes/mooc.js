var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Tutorial = require('../models/tutorial');
var User = require('../models/user');
var Commentcours = require('../models/commentcour');
var db=require('monk')('localhost/project');
var Report = require('../models/report');
var Category= require('../models/categorie');
var Mentor= require('../models/mentor');



function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){
		
		return next();
	}
	res.send('you don t have acces to this page');

}

router.get('/:id',ensureAuthentication, function(req, res, next) {
	
	Tutorial.find({},function(err,tutorials)
		{  res.render('tutorial', {"user":req.user,'tutorials':tutorials,'title':'mooc','id':req.params.id});

	}).limit(9);
})

router.get('/:id/addtutorial',ensureAuthentication ,function(req, res, next) {

	res.render('addtutorial', {"user":req.user,'title':'addtutorial','id':req.params.id});

})

router.post('/:id/addtutorial',function(req, res, next) {
	console.log(req.params.id);
	var title =req.body.title;
	var description= req.body.description;
	

	req.checkBody('title','name field is required').notEmpty();
	req.checkBody('description','description field is required').notEmpty();

	var errors = req.validationErrors();
	if(errors)
	{
		res.render('addtutorial',{
			'errors': errors,
			"user":req.user,

			'id':req.params.id,
			'title':'addtutorial'

		});
	}
	else{User.findById(req.params.id,function(err,user){
		var newTutorial = new Tutorial({
			'title': title,
			'description': description,
			'instructor': user.username,
			'instructorId': req.params.id
		});
	//create tutorial
	Tutorial.createTutorial(newTutorial, function(err,tutorial){
		if(err) throw err;
		res.redirect('/mooc/' + req.params.id + '/mytutorials/' + tutorial.id);
	});
});
		req.flash('success','Tutorial successfully created');
	}
})

router.get('/:id/mytutorials',ensureAuthentication, function(req,res,next){

	Tutorial.find({'instructorId': req.params.id}, function(err, tutorials){
		res.render('mytutorials', {"user":req.user,'title': 'My Tutorials','id': req.params.id, 'tutos': tutorials})
	});
})


router.get('/:id/mytutorials/:idt',ensureAuthentication ,function(req,res){
Tutorial.findById(req.params.idt,function(err,Tutorial){
	Commentcours.find({"cours":Tutorial.id}, function(err,commentcours){
		res.render('tuto',{"user":req.user,"id":req.params.id,"idt":req.params.idt,"commentcours":commentcours,"tutorial":Tutorial,'title': 'My Tutorials',"username":req.user.username });
	})
})
})


router.post('/:id/mytutorials/:idt',function(req,res){
var added = req.body.submit;
var comment = req.body.coment;

if(added=='Add Lesson')
{Tutorial.findById(req.params.idt,function(err,Tutorial){

Commentcours.find({"cours":Tutorial.id}, function(err,commentcours){
res.render('tuto',{"user":req.user,"commentcours":commentcours,"addlesson":"Add Lesson", 'title': 'My Tutorials', "id":req.params.id,"idt":req.params.idt,"tutorial":Tutorial});
})
})	
}
else if(added == 'comment'){
	var newCommentcours = new Commentcours({
					coment: comment,

					username: req.user.username,

					cours: req.params.idt});
		Commentcours.createCommentcours(newCommentcours,function(err,comment){
			if(err) throw err;
			console.log(comment);
	})
	req.flash('success','comment cours added');
	res.redirect('/mooc/'+req.params.id + '/mytutorials/'+ req.params.idt);
}
else if(added== 'report')
	{
		

		res.redirect('/mooc/'+req.params.id+'/mytutorials/'+req.params.idt+'/report')
	
}
else
{   var lesson_title = req.body.lesson_title;
	var lesson_number = req.body.lesson_number; 
	var lesson_body = req.body.lesson_body;
	var videoName = req.files.lesson_video.originalname;
    var videoName = req.files.lesson_video.name;
    var videoMime = req.files.lesson_video.mimetype;
    var videoPath = '/' + req.files.lesson_video.path.replace(/\\/g,"/"); ;
    var videoExt = req.files.lesson_video.extension;
    var videoSize = req.files.lesson_video.size;

	req.checkBody('lesson_title','title field is required').notEmpty;
	req.checkBody('lesson_number','lesson number field is required').notEmpty;
	req.checkBody('lesson_body','lesson body field is required').notEmpty;
	req.checkBody('lesson_video','video is required').notEmpty;


var errors = req.validationErrors();
if(errors)
{
res.render('tuto',{
	errors: errors,
	name: name,
	email: email,
	username: username,
	password: password,
    "user":req.user,
	password2: password2,
	title: 'My Tutorials'
});
}
else{

	
	
	Tutorial.findByIdAndUpdate(req.params.idt, { $push:{ "lessons":{"lesson_title":lesson_title,"lesson_number":lesson_number,"lesson_body":lesson_body, "lesson_video": videoPath}  }}, {safe:true, upsert:true}, function(err, newBody){

			if(err) throw err;
			console.log('post updated: ' + newBody);
		});
	
	res.redirect('/mooc/'+req.params.id+'/mytutorials/'+req.params.idt);
}
}
})
router.get('/:id/mentoring',ensureAuthentication,function(req,res,next)
	{
		Category.find({},function(err,categories)
	{
res.render('mentoring',{"user":req.user,'categories':categories,'title':'mentoring','id':req.params.id});
});
	})
router.post('/:id/mentoring',ensureAuthentication,function(req,res,next){

	var choiceField= req.body.fieldOfSpecialty;
	var choiceMentor= req.body.mentor;
	var submit = req.body.submit;
	if(submit=='Next')
	{
		User.find({"speciality":choiceField},function(err,mentors){
			var newMentor = new Mentor({
			'student_name': req.user.username,
			'field': choiceField,
			'mentor':'',
			'accepted':'false'
			
		});
			Mentor.createMentor(newMentor,function(err,mentor){
				console.log('succeful creation'+mentor);
			})
			res.render("mentoring",{"user":req.user,"mentors":mentors,"id":req.params.id,"yes":"yes"});
		})
    }
    else
    {   
    	Mentor.findOneAndUpdate({"mentor":""},{"mentor":choiceMentor},function(err,mentor){
    		User.findOne({"username":choiceMentor},function(err,user){
    			user.numberOfNotification++;
    			console.log(user);
    		    user.save();
    		})
         console.log(mentor);
         res.redirect('/mooc/'+req.params.id);
    	})
    }
})


router.get('/:id/mytutorials/:idt/lessons/:lesson',ensureAuthentication, function(req, res, next) {
	Tutorial.findById(req.params.idt,function(err,Tutorial){
		Tutorial.lessons.forEach(function(l){
			if (l['lesson_title']==req.params.lesson) {
				res.render('lesson',{"user":req.user,"id":req.params.id,"idt":req.params.idt,"lesson":l,'title':'lesson'});
			}
		})

})
})


router.get('/:id/mytutorials/:idt/report',function(req,res,next){
	res.render('report',{"title":"reportc",'id':req.params.id,'idt':req.params.idt})
})

router.post('/:id/mytutorials/:idt/report',function(req,res,next){
	var content=req.body.content;
	var newReport = new Report({
				username: req.user.username,
				content: content,
				type: "tutorial",
				id:req.params.idt,
				
				
			});
	//create user
	Report.createReport(newReport, function(err,report){
		if(err) throw err;
		console.log(report);
	})
	req.flash('success','you are now regitered and may log in');
	res.redirect('/mooc/' + req.user.id);
	
})


module.exports = router;