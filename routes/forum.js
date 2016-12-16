var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Post = require('../models/post');
var User = require('../models/user');
var Report = require('../models/report');
var Categorie = require('../models/categorie');
var Comment = require('../models/comment');
var Mentor = require('../models/mentor');
var Generalcategorie = require('../models/generalcategorie');
var db=require('monk')('localhost/project');
var BBCodeParser = require('bbcode-parser');
var bbcode = require('bbcode');

function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){


		return next();
	}
	res.send('you don t have acces to this page');

};
function ensureadmin(req,res,next){
	if(req.user.username=='admin'){


		return next();
	}
	res.send('you don t have acces to this page');

};

router.get('/:id',ensureAuthentication,function(req,res,next)

{   Mentor.find({"mentor":req.user.username},function(err,notifications)

{

	var categories = db.get('categories');
	categories.find({},function(err,categories)
	{
		Generalcategorie.find({},function(err,generals){
		if (err) throw err

			res.render('forum',{"user":req.user,"notifications":notifications,"categories":categories,"title":"generalcategory","id":req.params.id,"generals":generals});
	});
	});
});
})

router.get('/:id/myposts',ensureAuthentication,function(req, res, next) 
{   


	User.findById(req.params.id,function(err,user){
		var posts = db.get('posts');
		posts.find({"author":user.username},function(err,posts){
			res.render('myposts',{"user":req.user,"title":"my posts" , "posts":posts,"id":req.params.id});
		});
	});
})


router.get('/:id/add',ensureAuthentication, function(req, res, next) {
	var categories = db.get('categories');
	categories.find({},function(err,categories)
	{
		res.render('addpost',{"user":req.user,"categories":categories,"title":"addpost" , "id":req.params.id});
	})


});
router.post('/:id/add', function(req, res, next) {

	var title = req.body.title;

	var oldbody = req.body.body;

	var category = req.body.category;

	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();
	req.checkBody('category','Category field is required').notEmpty();

	var errors=req.validationErrors();

	bbcode.parse(oldbody,function(body){

	//var body = html;
		if(errors)

	{
		res.render('addpost',{
			"errors":errors,
			"title":title,
			"body":body,
			"catgory":category,
			"id":req.params.id,
			"user":req.user
		});
	}
	else
	{
		console.log(req.params.id);
		User.findById(req.params.id,function(err,user){
			var newPost = new Post({
				title: title,
				body: body,
				bbody: oldbody,
				author: user.username,
				category: category,
			});

	//create post
	Post.createPost(newPost, function(err,post){
		if(err) throw err;
		console.log(post);
	})
	req.flash('success','you added a new post');
	res.render('addpost',{"user":req.user,"title":"addpost", "id":req.params.id});

});
	}
		})
});
router.get('/:id/addgeneralcategory',ensureAuthentication,ensureadmin, function(req,res,next)
{    User.find({},function(err,user)
	{res.render('addgeneralcategorie',{"user":req.user,"id":req.params.id,"title":"addgeneralcategory","users":user});
})
})
router.post('/:id/addgeneralcategory', function(req, res, next) {


	var title = req.body.title;
	var moderator = req.body.moderator;


	req.checkBody('title','name field is required').notEmpty();
	req.checkBody('moderator','name field is required').notEmpty();


	var errors=req.validationErrors();
	if(errors)
	{
		res.render('addgeneralcategorie',{
			"errors":errors,
			"user":req.user,
			"title":title,
			"moderator":moderator,
			"id":req.params.id

		});
	}
	else
	{
		var newGeneralCategorie = new Generalcategorie({
			title:title,
			moderator:moderator
		});
	//create category
	Generalcategorie.createGeneralCategorie( newGeneralCategorie , function(err,categorie){
		if(err) throw err;
		User.findOneAndUpdate({"username":moderator},{$push:{moderation:{"title":title}}},function(err,user){
		 if (err) throw err;
		 console.log("moderator added successfuly");
		})
	})
	req.flash('success','you are now added a new post');
	res.redirect('/forum/'+req.params.id);
}


});
router.get('/:id/addcategory',ensureAuthentication, function(req,res,next)
{   Generalcategorie.find({},function(err,generalcats){
	res.render('addcategorie',{"user":req.user,"id":req.params.id,"generalcats":generalcats,"title":"addcategory"});

});

})
router.post('/:id/addcategory', function(req, res, next) {

	var title = req.body.title;
	var general = req.body.general;


	req.checkBody('title','name field is required').notEmpty();
	req.checkBody('general','name field is required').notEmpty();


	var errors=req.validationErrors();
	if(errors)
	{
		res.render('addcategorie',{
			"errors":errors,
			"title":title,
			"user":req.user,
			"general":general,
			"id":req.params.id
		});
	}
	else
	{
		var newCategorie = new Categorie({
			title:title,
			general:general
		});
	//create category
	Categorie.createCategorie(newCategorie, function(err,categorie){
		if(err) throw err;
	})
	req.flash('success','you are now added a new post');
	res.redirect('/forum/'+req.params.id);
}



});
router.get('/:id/:category',ensureAuthentication, function(req, res, next) {
	var posts = db.get('posts');
	posts.find({"category":req.params.category},function(err,posts){
		res.render('myposts',{"user":req.user,"title":"my posts" , "posts":posts,"id":req.params.id});
	});
})

router.get('/:id/myposts/:idp',ensureAuthentication, function(req, res, next){
	Post.findById(req.params.idp,function(err,post){
		console.log(post);
		User.findById(req.params.id,function(err,user){
			console.log(user);
			Comment.find({"post":req.params.idp},function(err,comments){
			console.log(comments);
			res.render('myposts2',{"user":req.user,"title":"my posts" , "post":post,"id":req.params.id, "username": user.username, "comments":comments});
			});
	});
	})
});

router.post('/:id/myposts/:idp',function(req,res,next){
	var comment = req.body.comment;
	var action = req.body.submit;
	req.checkBody('comment','comment field is required').notEmpty();
	
	if(action == 'Delete'){
		var posts=db.get('posts');
		posts.remove({_id:req.params.idp});
		res.redirect('/forum/'+req.params.id+'/myposts')
	}
	else if(action== 'report')
	{
		res.redirect('/forum/'+req.params.id+'/myposts/'+req.params.idp+'/report')
	}
	else if (action == 'Modify'){
		Post.findById(req.params.idp,function(err,post){
		console.log(post);
		User.findById(req.params.id,function(err,user){
			console.log(user);
			Comment.find({"post":req.params.idp},function(err,comments){
			console.log(comments);
			res.render('myposts2',{"user":req.user,"title":"my posts" , "post":post,"id":req.params.id, "username": user.username, "comments":comments, 'modify': 'Modify'});
			});
	});

	});

	}
	else if (action == 'Save'){
		console.log('save');
		var bodynew = req.body.newBody;
		bbcode.parse(bodynew,function(newBody){
		Post.findByIdAndUpdate(req.params.idp, { $set: { 'body': newBody, 'bbody': bodynew }}, {safe:true, upsert:true}, function(err, newBody){
			if(err) throw err;
			console.log('post updated: ' + newBody);
		});
		res.redirect('/forum/'+req.params.id+'/myposts/'+req.params.idp);
	})
	}
	else if (action == 'Cancel'){
		res.redirect('/forum/'+req.params.id+'/myposts/'+req.params.idp);
	}
	else
	{
		var errors=req.validationErrors();
		if(errors)

			{

		     Post.findById(req.params.idp,function(err,posts)
		{    User.findById(req.params.id,function(err,user){
			var comments = db.get('comments');
			Comment.findById(posts.id,function(err,comments){
				res.render('myposts2',{"user":req.user,"title":"my posts" ,"errors":errors, "username":user.username,"post":posts,"id":req.params.id,"comments":comments});
			});
		});
		});
	}
	else
	{
		User.findById(req.params.id,function(err,user){
				var newComment = new Comment({
					coment: comment,

					username: user.username,

					post: req.params.idp});
		Comment.createComment(newComment,function(err,comment){
			if(err) throw err;
			console.log(comment);
	})
	req.flash('success','comment added');
	res.redirect('/forum/'+req.params.id+'/myposts/'+req.params.idp);
	})
}
	}

	});


router.get('/:id/myposts/:idp/report',function(req,res,next){
	res.render('report',{'title':'reprort','id':req.params.id,'idp':req.params.idp})
})

router.post('/:id/myposts/:idp/report',function(req,res,next){
	var content =req.body.content;
	User.findById(req.params.id,function(err,user){
	var newReport = new Report({
				username: user.username,
				content: content,
				type: "post",
				id:req.params.idp,
				
				
			});
	//create user
	Report.createReport(newReport, function(err,report){
		if(err) throw err;
		console.log(report);
	})
	req.flash('success','you are now regitered and may log in');
	res.redirect('/forum/' + req.user.id);})
	
})

module.exports = router;

