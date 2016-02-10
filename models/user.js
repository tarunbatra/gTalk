var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var _=require('underscore');

var model=mongoose.model('users',new Schema(
	{
		username	:	{type:String,required:true, unique:true, dropDups:true},
		password	:	{type:String,required:true},
		peers       :
			[{
				peerid  	:	{type:Schema.Types.ObjectId, ref: 'users', required:true},
				status      :   {type:Number, required:true},
				notification:   {type:Boolean},
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

model.sendReq=function(data,cb)
{
	var dis=this;
	model.getOne(data.from,function(e,d)
	{
		if(!e)
		{
			dis.findOneAndUpdate({_id:d._id},{$addToSet:{peers:{peerid:data.to._id,status:1}}},function(er,da)
			{
				if(!er)
				{
					dis.findOneAndUpdate({_id:data.to._id},{$addToSet:{peers:{peerid:d._id,status:2}}},function(rr,ta)
					{
						if(!rr)
						{
							cb(er|rr,da);
						}
					});
				}
			});
		}
	});
};

model.cancelReq=function(data,cb)
{
	var dis=this;
	model.getOne(data.from,function(e,d)
	{
		if(!e)
		{
			dis.findOneAndUpdate({_id:d._id},{$pull:{peers:{peerid:data.to._id}}},function(er,da)
			{
				if(!er)
				{
					dis.findOneAndUpdate({_id:data.to._id},{$pull:{peers:{peerid:d._id}}},function(rr,ta)
					{
						if(!rr)
						{
							cb(er|rr,da);
						}
					});
				}
			});
		}
	});

};

model.acceptReq=function(data,cb)
{

};

model.rejectReq=function(data,cb)
{
	var dis=this;
	model.getOne(data.from,function(e,d)
	{
		if(!e)
		{
			dis.findOneAndUpdate({_id:d._id},{$pull:{peers:{peerid:data.to._id}}},function(er,da)
			{
				if(!er)
				{
					dis.findOneAndUpdate({_id:data.to._id},{$pull:{peers:{peerid:d._id}}},function(rr,ta)
					{
						if(!rr)
						{
							cb(er|rr,da);
						}
					});
				}
			});
		}
	});

};

module.exports=model;