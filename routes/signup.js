var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var User = require('../models/user')

var Category = require('../models/categorie')

var db=require('monk')('localhost/project');

function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){
		res.redirect('/forum/'+req.user.id);
		
	}
	return next();

}
router.get('/', ensureAuthentication ,function(req, res, next) {

	Category.find({},function(err,categories)
	{
		res.render('signup', {'title':'Register','categories':categories});
	})
})

router.post('/',function(req,res,next)
	{   var usernameexist=" "
	var emailexist =" "
	var name =req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
	var fieldOfSpecialty=req.body.fieldOfSpecialty;
	if(req.files.profileimage)
	{
		console.log('uploading File ...');
		var profileImageOriginalName = req.files.profileimage.originalname;
		var profileImageName = req.files.profileimage.name;
		var profileImageMime = req.files.profileimage.mimetype;

		var profileImagePath = '/' + req.files.profileimage.path.replace(/\\/g,"/");

		var profileImageExt = req.files.profileimage.extension;
		var profileImageSize = req.files.profileimage.size;
	}
	else{
		var profileImageName = 'noimage.png';
	}
	User.findOne({"username":username},function(err, userusername){
		if (userusername){
			if (userusername.email == email){
				req.checkBody('username','username already exists').equals(!userusername.username);
				req.checkBody('email','email already exists').equals(!userusername.email);
			}else{
				req.checkBody('username','username already exists ').equals(!userusername.username);
			}
			console.log(userusername.username,userusername.email);
			req.checkBody('name','name field is required').notEmpty();
			req.checkBody('email','Invalid email adress').isEmail();

			req.checkBody('username','username field is required').notEmpty();

			req.checkBody('password','password field is required').notEmpty();
			req.checkBody('password2','The passwords you entered don\'t match').equals(req.body.password);
			var errors = req.validationErrors();
			console.log(errors);
			if(errors)
				{ Category.find({},function(err,categories)
				{
					res.render('signup',{
						errors: errors,
						name: name,
						email: email,
						username: username,
						password: password,
						password2: password2,
						categories:categories

					})
				});
		}else{

			var newUser = new User({
				name: name,
				email: email,
				username: username,
				speciality: fieldOfSpecialty,
				password: password,
				"banned":"false",
				"numberOfNotification":0
				
			});
	//create user
	User.createUser(newUser, function(err,user){
		if(err) throw err;
		console.log(user);
	})
	req.flash('success','you are now regitered and may log in');
	res.redirect('/forum/' + newUser.id);
}
}else{
	User.findOne({"email":email},function(err, usermail){
		if(usermail){
			req.checkBody('email','email already exists ').equals(!usermail.email);
		}
		req.checkBody('name','name field is required').notEmpty();
		req.checkBody('email','Invalid email adress').isEmail();

		req.checkBody('username','username field is required').notEmpty();

		req.checkBody('password','password field is required').notEmpty();
		req.checkBody('password2','The passwords you entered don\'t match').equals(password);
		var errors = req.validationErrors();
		console.log(errors);
		if(errors)
			{ Category.find({},function(err,categories)
			{
				res.render('signup',{
					errors: errors,
					name: name,
					email: email,
					username: username,
					password: password,
					password2: password2,
					categories:categories

				})
			});
	}else{

		var newUser = new User({
			name: name,
			email: email,
			username: username,
			speciality: fieldOfSpecialty,
			password: password
		});
	//create user
	User.createUser(newUser, function(err,user){
		if(err) throw err;
		console.log(user);
	})
	req.flash('success','you are now regitered and may log in');
	res.redirect('/login');
}
})
}
})
});

module.exports = router;
