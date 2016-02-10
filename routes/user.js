var hasher=require('./../middlewares/hasher');
var responder=require('./../middlewares/responder');
var userDB=require('./../models/user');
var jwtGenerator=require('./../middlewares/jwtGenerator');
var authenticator=require('./../middlewares/authenticator');
var comparer=require('./../middlewares/comparer');

var user=
{
    getAll:function(req,res,next)
    {
        userDB.getAll(function(err,data)
        {
            responder(req,res,err,data);
        });
    },

    getOne:function(req,res,next)
    {
        userDB.getOne(req.params.id,function(err,data)
        {
            responder(req,res,err,data);
        });
    },

	signIn:function(req,res,next)
	{
		userDB.signIn(
			{
				username:req.body.username
			},
			function(err,data)
			{
				if(err ||!data)
				{
					responder(req,res,err,data);
				}
				else
                {
                    req.body.hash= data.password;
                    req.body.data={username:data.username};
					next();
				}
			});
	},
	signUp:function(req,res,next)
	{
		userDB.signUp(
			{
				username:req.body.username,
				password:req.body.password
			},
			function(err)
			{
				if(err)
				{
					responder(req,res,err);
				}
				else
				{
					req.body.data={username:req.body.username};
					next();
				}
			});
	}
};



var router=require('express').Router();
router.get('/',user.getAll);
router.get('/:id',user.getOne);
router.post('/sign_in',user.signIn,comparer,jwtGenerator);
router.post('/sign_up',hasher,user.signUp,jwtGenerator);
module.exports=router;

