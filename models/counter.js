var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var counterSchema=new Schema(
{
	id		:	{type:Number,default:1}
});
var model=mongoose.model('counters',counterSchema);

model.incrementCounter=function(targetModel,cb)
{
	this.findOneAndUpdate({},{$inc:{'id':1}},{upstart:true},function(err,data)
	{
		if(err)
		{
			next(err);
		}
		else
		{
			console.log(JSON.stringify(data));
			targetModel.id=data.id;
			cb();
		}
	});
};
module.exports=model;
