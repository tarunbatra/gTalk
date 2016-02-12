var sockets={};
var user=require('./../models/user');
var message=require('./../models/messages');
var responder=require('./../middlewares/responder');
var _=require('underscore');


var emitNotif=function(type,to,data)
{
	console.log(JSON.stringify(data));
	try
	{
		sockets[to].emit(type,data);
	}
	catch(e)
	{
		console.log('User isn\'t online');
	}
};

module.exports=function(io)
{
	io.on('connection',function(socket)
	{
		socket.on('connection',function(data)
		{
			console.log('connected '+data.username);
			//for personal msgs
			sockets[data._id]=socket;
			user.setOnline(data.username,true,function(error)
			{
				if(error) console.log(error);
			});
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
			console.log('disconnected '+data);
			user.setOnline(data,false,function(error)
			{
				if(error) console.log(error);
			});
			user.getAll(function(err,userData)
			{
				if(err) console.log(err);
				io.emit('notification',
					{
						users:userData
					});
			});
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
					emitNotif('notification',data.from,
						{
							users:usersData,
							cause:data.to,
							code:1
						});
					emitNotif('notification',data.to,
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
					emitNotif('notification',data.from,
						{
							users:usersData,
							cause:data.to,
							code:0
						});
					emitNotif('notification',data.to,
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
			user.acceptReq(data,function(err)
			{
				if(err) console.log(err);

				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);
					emitNotif('notification',data.from,
						{
							users:usersData,
							cause:data.to,
							code:3
						});
					emitNotif('notification',data.to,
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

					emitNotif('notification',data.from,
						{
							users:usersData,
							cause:data.to,
							code:0
						});
					emitNotif('notification',data.to,
						{
							users:usersData,
							cause:data.from,
							code:0
						});
				});
			});
		});


		socket.on('addMessage', function (msgData)
		{
			console.log('adding message');
			message.add(msgData,function(err)
			{
				if(err) console.log(err);
				message.get(msgData.from,msgData.to,function(err,data)
				{
					emitNotif('newMessages',msgData.from,data);
					emitNotif('newMessages',msgData.to,data);
					console.log('msgs sent');
				});

			});
		});
		socket.on('getMessages',function(msgData)
		{
			console.log('getting messages');
			console.log(JSON.stringify(msgData));
			message.get(msgData.from,msgData.to,function(err,data)
			{
				emitNotif('newMessages',msgData.from,data);
				emitNotif('newMessages',msgData.to,data);
				console.log('msgs sent');
			});
		});

		socket.on('readMessages',function(data)
		{
			console.log('reading messages');
			message.read(data.from,data.to,function(err,d)
			{
				console.log('msgs read');
			});
		});

	});
};
