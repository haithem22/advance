var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var User = require('../models/user')


// function logout
router.get('/',function(req, res, next) {
  req.logout();
  res.redirect('/login')
});
module.exports = router;
