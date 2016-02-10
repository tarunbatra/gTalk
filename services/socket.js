var sockets={};
var user=require('./../models/user');
var responder=require('./../middlewares/responder');
var _=require('underscore');
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
				if(err) console.log(err);
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
				if(err) console.log(err);
				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);

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
				if(err) console.log(err);
				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);

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
			user.acceptReq(data,function(err)
			{
				if(err) console.log(err);

				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);

					sockets[data.from].emit('notification',
						{
							users:usersData,
							cause:data.to,
							code:3
						});
					sockets[data.to.username].emit('notification',
						{
							users:usersData,
							cause:data.from,
							code:3
						});
				});
			});

		});

		socket.on('rejectReq',function(data)
		{
			console.log('rejectReq');
			user.rejectReq(data,function(err)
			{
				if(err) console.log(err);
				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);

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
			user.addMsg(msgData,function(err)
			{
				if(err) console.log(err);

				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);
					sockets[msgData.from.username].emit('notification',
						{
							users:usersData
						});
					sockets[msgData.to.username].emit('notification',
						{
							users:usersData,
							cause:msgData.from.username,
							code:3
						});
				});
			});
		});
	});
};