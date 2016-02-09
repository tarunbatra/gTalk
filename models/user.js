const counter=require('./counter');
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var model=mongoose.model('users',new Schema(
	{
		id 			:	{type:Number},
		username	:	{type:String,required:true,unique:true,dropDups:true},
		password	:	{type:String,required:true}
	}).pre('save',function(next)
	{
		counter.incrementCounter(model,function()
			{
				next();
			});
	})
	);

model.signIn=function(data,cb)
{
	this.findOne({username:data.username,password:data.password},{_id:false,__v:false},function(err,data)
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