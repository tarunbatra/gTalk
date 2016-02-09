var hasher=require('./../middlewares/hasher');
var responder=require('./../middlewares/responder');
var userDB=require('./../models/user');
var jwtGenerator=require('./../middlewares/jwtGenerator');
var comparer=require('./../middlewares/comparer');
var user=
{
    getAll:function(req,res,next)
    {
        console.log('getAll');
        userDB.getAll(function(err,data)
        {
            responder(req,res,err,data);
        });
    },
    getOne:function(req,res,next)
    {
        console.log('getAll');
        userDB.getOne(req.params.id,function(err,data)
        {
            responder(req,res,err,data);
        });
    },
	signIn:function(req,res,next)
	{
		console.log('signIn');
		userDB.signIn(
			{
				username:req.body.username
			},function(err,data)
			{
				if(err ||!data)
				{
					console.log('Failed');
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
	},
    send:function(req,res,next)
    {
        console.log("send");
        var obj={};
        obj.from=req.params.id1;
        obj.to=req.params.id2;
        obj.msg=req.body.msg;
        obj.time=(new Date()).getTime();
        responder(req,res,0,obj);
    }
};


var router=require('express').Router();
router.get('/',user.getAll);
router.get('/:id',user.getOne);
router.post('/sign_in',user.signIn,comparer,jwtGenerator);
router.post('/sign_up',hasher,user.signUp,jwtGenerator);
router.post('/:id1/send/:id2',user.send);
module.exports=router;