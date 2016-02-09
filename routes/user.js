var hasher=require('./../middlewares/hasher');
var responder=require('./../middlewares/responder');
var userDB=require('./../models/user');
var jwtGenerator=require('./../middlewares/jwtGenerator');
var comparer=require('./../middlewares/comparer');
var user=
{
	signIn:function(req,res,next)
	{
		console.log('signIn');
        console.log(req.body.password);
		userDB.signIn(
			{
				username:req.body.username,
			},function(err,data)
			{
				if(err ||!data)
				{
					console.log('Failed');
					responder(req,res,err,data);
				}
				else
                {
                    req.body.hash=data.password;
					next();
				}
			});
	},
	signUp:function(req,res,next)
	{
		console.log('signUp');
        console.log(req.body.password);
		userDB.signUp(
			{
				username:req.body.username,
				password:req.body.password
			},function(err)
			{
				if(err)
				{
					console.log('Failed');
					console.log(err);
					responder(req,res,err);
				}
				else
				{
					console.log('Success');
					req.body.data={username:req.body.username};
					next();
				}
			});

	}
};


var router=require('express').Router();

router.post('/sign_in',user.signIn,comparer,jwtGenerator);
router.post('/sign_up',hasher,user.signUp,jwtGenerator);
module.exports=router;