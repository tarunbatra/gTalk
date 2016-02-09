var bcrypt=require('bcrypt');
var responder=require('./responder');

module.exports=function(req,res,next)
{
    bcrypt.compare(req.body.password,req.body.hash,function(err,res)
    {
        if(err)
        {
            responder(req,res,err);
        }
        else
        {
            console.log('Success');
            req.body.data={username:req.body.username};
            next();
        }
    });
};
