var responder=require('./../middlewares/responder');
var userDB=require('./../models/user');
var jwtGenerator=require('./../middlewares/jwtGenerator');
var user=
{
	signIn:function(req,res,next)
	{
		console.log('signIn');
		userDB.signIn(
			{
				username:req.body.username,
				password:req.body.password
			},function(err,data)
			{
				if(err ||!data)
				{
					console.log('Failed');
					console.log(err||JSON.stringify(data));
					responder(req,res,err,data);
				}
				else
				{
					console.log('Success');
					req.body.data={username:req.body.username};
					next();
				}
			});
	},
	signUp:function(req,res,next)
	{
		console.log('signUp');
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

router.post('/sign_in',user.signIn,jwtGenerator);
router.post('/sign_up',user.signUp,jwtGenerator);
module.exports=router;