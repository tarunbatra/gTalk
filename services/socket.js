var sockets={};
var user=require('./../models/user');
var responder=require('./../middlewares/responder');
module.exports=function(io)
{
	io.on('connection',function(socket)
	{
		socket.on('connection',function(data)
		{
			console.log('connected '+data.username);
			//for personal msgs
			sockets[data.username]=socket;

			user.getAll(function(err,userData)
			{
				if(err) responder(req,res,err);
				io.emit('notification',
					{
						users:userData
					});
			});
		});

		socket.on('disconnection',function(data)
		{
			delete sockets[data.username];
		});

		socket.on('sendReq',function(data)
		{
			console.log('sendReq');
			user.sendReq(data,function(err)
			{
				if(err) responder(req,res,err);
				user.getAll(function(err,usersData)
				{
					if(err) responder(req,res,err);

					sockets[data.from].emit('notification',
						{
							users:usersData,
							cause:data.to,
							code:1
						});
					sockets[data.to.username].emit('notification',
						{
							users:usersData,
							cause:data.from,
							code:2
						});
				});
			});
		});

		socket.on('cancelReq',function(data)
		{
			console.log('cancelReq');
			user.cancelReq(data,function(err)
			{
				if(err) responder(req,res,err);
				user.getAll(function(err,usersData)
				{
					if(err) responder(req,res,err);

					sockets[data.from].emit('notification',
						{
							users:usersData,
							cause:data.to,
							code:0
						});
					sockets[data.to.username].emit('notification',
						{
							users:usersData,
							cause:data.from,
							code:0
						});
				});
			});
		});

		socket.on('acceptReq',function(data)
		{
			console.log('acceptReq');
			//TODO:buggy


		});

		socket.on('rejectReq',function(data)
		{
			console.log('rejectReq');
			user.rejectReq(data,function(err)
			{
				if(err) responder(req,res,err);
				user.getAll(function(err,usersData)
				{
					if(err) responder(req,res,err);

					sockets[data.from].emit('notification',
						{
							users:usersData,
							cause:data.to,
							code:0
						});
					sockets[data.to.username].emit('notification',
						{
							users:usersData,
							cause:data.from,
							code:0
						});
				});
			});
		});

		socket.on('newMessage',function(msgData)
		{
			user.getOne(msgData.from.username,function(err,userData)
			{
				user.addMsg(msgData,function(err)
				{
					if(err) responder(req,res,err);
					console.log('msg added');
				});
			});
		});

	});
};