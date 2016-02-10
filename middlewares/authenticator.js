const responder=require('./responder');
const jwt=require('jsonwebtoken');
const config=require('./../config');
module.exports=function(req,res,next)
	{
		 var t=req.body.token||req.query.token||req.headers['x-access-token'];
		 if(t)
		 {
		 	jwt.verify(t,config.secret,function(err,decoded)
	 		{
	 			if(!err)
	 			{
	 				req.decoded=decoded._doc;
	 				next();
	 			}
	 		});
	 	}
		responder(req,res,1);
	};