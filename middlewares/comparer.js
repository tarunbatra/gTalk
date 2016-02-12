var bcrypt=require('bcrypt');
var responder=require('./responder');

module.exports=function(req,res,next)
{
    bcrypt.compare(req.body.password,req.body.hash,function(err)
    {
        if(err)
        {
            responder(req,res,err);
        }
        else
        {
            console.log('Success');
            next();
        }
    });
};
