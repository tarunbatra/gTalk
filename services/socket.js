var sockets={};
var user=require('./../models/user');
var responder=require('./../middlewares/responder');
var _=require('underscore');


var emitNotif=function(type,to,data)
{
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
			console.log('disconnected '+data);
			try
			{
				delete sockets[data.username];
			}
			catch(e){}
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
							cause:data.to.username,
							code:1
						});
					emitNotif('notification',data.to.username,
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
							cause:data.to.username,
							code:0
						});
					emitNotif('notification',data.to.username,
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
			console.log(JSON.stringify(data));
			user.acceptReq(data,function(err)
			{
				if(err) console.log(err);

				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);
					emitNotif('notification',data.from,
						{
							users:usersData,
							cause:data.to.username,
							code:3
						});
					emitNotif('notification',data.to.username,
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
							cause:data.to.username,
							code:0
						});
					emitNotif('notification',data.to.username,
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
			var from=msgData.from;
			var to=msgData.to.username;
			user.addMsg(msgData,function(err)
			{
				if(err) console.log(err);

				user.getAll(function(err,usersData)
				{
					if(err) console.log(err);
					emitNotif('notification',from,
						{
							users:usersData
						});
					emitNotif('notification',to,
						{
							users:usersData,
							cause:from
						});
				});
			});
		});
	});
};
