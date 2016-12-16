var express = require('express');
var router = express.Router();
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
var mongo = require('mongodb');
var User = require('../models/user');

function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){
		res.redirect('/forum/'+req.user.id);

	}
	return next();

}

// display page login

router.get('/', ensureAuthentication ,function(req,res)
{
	res.render('login',{"title":"login"});
})


//verification login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username,password,done)
{
	var query = {username:username, password:password};
User.findOne({username:username},function(err,user)
{   if (err) throw err;
	if(!user)
	{
		console.log('wrong username');

        return done(null,false,{message:'unknown user'});


	}
	else
	{
		User.findOne(query,function(err,pass){

			if(!pass)
			{ console.log('wrong password');

            return done(null,false,{message:'invalid password'});
			}
			else
			{User.findOne(query,function(err,ban){
				if (ban.banned=="true")
			    { console.log('you re banned');

                     return done(null,false,{message:'banned'});
			    }
			    else
			    {

			    	return done(null,ban);
			    }

			})

				
			}

		})
	}

})

}))
router.post('/',passport.authenticate('local',{failureRedirect:'/login'}),function(req,res){

console.log('successful authentification');
req.flash('succes','you are logged in');

res.redirect('/forum/'+req.user.id);
})
module.exports = router;
