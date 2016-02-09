var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var model=mongoose.model('users',new Schema(
	{
		username	:	{type:String,required:true, unique:true, dropDups:true},
		password	:	{type:String,required:true},
		peers       :
			[{
				peerid  	:	{type:Schema.Types.ObjectId, ref: 'users', required:true},
				status      :   {type:Number, required:true},
				messages    :
					[{
						from    :   {type:Schema.Types.ObjectId, ref: 'users', required:true},
						to      :   {type:Schema.Types.ObjectId, ref: 'users', required:true},
						msg     :   {type:String,required:true},
						time    :   {type:Date,required:true}
					}]
			}]
	}));

model.getAll=function(cb)
{
    this.find({},{__v:false,password:false},function(err,data)
    {
        cb(err,data);
    });
};

model.getOne=function(uname,cb)
{
    this.findOne({username:uname},{__v:false,password:false},function(err,data)
    {
        cb(err,data);
    });
};

model.signIn=function(data,cb)
{
	this.findOne({username:data.username},{__v:false},function(err,data)
	{
		cb(err,data);
	});
};
model.signUp=function(data,cb)
{
	var u=new this(data);
	u.save(function(err)
	{
		cb(err);
	});
};

module.exports=model;