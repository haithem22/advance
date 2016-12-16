var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/' ,ensureAuthentication, function(req, res, next) {
  res.render('index', { title: 'advance' });
})

/* GET users listing. */
router.get('/user/:id',function(req,res)
{
	var id = req.params.id;
	User.findById(id,function(err,user)
	{
		if(user)
		{
			console.log('user')
			res.render('membre',{"user":user,"id":user.id});
		}
		else
		{
			res.send('wrong ID');
		}
	})
})
function ensureAuthentication(req,res,next){
	if(req.isAuthenticated()){

		res.redirect('/forum/'+req.user.id);
		

	}
	return next();

}
module.exports = router;
