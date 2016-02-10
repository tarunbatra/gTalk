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
	var that=this;
	model.getOne(data.from,function(error,userData)
	{
		if(!error)
		{
			that.findOneAndUpdate({_id:userData._id},{$addToSet:{peers:{peerid:data.to._id,status:1}}},function(error)
			{
				if(!error)
				{
					that.findOneAndUpdate({_id:data.to._id},{$addToSet:{peers:{peerid:userData._id,status:2}}},function(error)
					{
						cb(error);
					});
				}
				cb(error);
			});
		}
		cb(error);
	});
};

model.cancelReq=function(data,cb)
{
	var that=this;
	model.getOne(data.from,function(error,userData)
	{
		if(!error)
		{
			that.findOneAndUpdate({_id:userData._id},{$pull:{peers:{peerid:data.to._id}}},function(error)
			{
				if(!error)
				{
					that.findOneAndUpdate({_id:data.to._id},{$pull:{peers:{peerid:userData._id}}},function(rr)
					{
						if(!error)
						{
							cb(error);
						}
					});
				}
				cb(error);
			});
		}
		cb(error);
	});

};

model.acceptReq=function(data,cb)
{

};

model.rejectReq=function(data,cb)
{
	var that=this;
	model.getOne(data.from,function(error,userData)
	{
		if(!error)
		{
			that.findOneAndUpdate({_id:userData._id},{$pull:{peers:{peerid:data.to._id}}},function(error)
			{
				if(!error)
				{
					that.findOneAndUpdate({_id:data.to._id},{$pull:{peers:{peerid:userData._id}}},function(error)
					{
						if(!error)
						{
							cb(error);
						}
					});
				}
				cb(error);
			});
		}
		cb(error);
	});
};

model.addMsg=function(msgData,cb)
{
	var that=this;
	model.getOne(msgData.from.username,function(error,userData)
	{
		if(!error)
		{
			console.log(JSON.stringify(userData));
			_.filter(userData.peers,function(peer)
			{
				if(peer._id==msgData.to._id)
				{
					peer.messages.push(msgData);
				}
			});
			userData.save(function(err,document,effectedLines)
			{
				if(!err)
				{
					cb();
				}
				cb(err);
			});
		}
		cb(error);
	});
};

module.exports=model;