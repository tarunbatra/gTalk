msgBox.controller('msgBoxController',['$scope','apiService','socketService',function($scope,user,socket)
{

    console.log('msgBoxController');
	$scope.messages=[];
	var me=JSON.parse(localStorage.getItem('data'));
	user.getOne({id:me.username},function(res)
	{
		me=res.body;
	});

	$scope.send=function()
	{
		if(!$scope.msg) return;
		var obj=
		{
			from    :   me._id,
			to      :   $scope.peer._id,
			msg     :   $scope.msg,
			time    :   (new Date()).getTime()
		};
		socket.emit('addMessage',obj);
		$scope.msg='';
		$scope.messages.unshift(obj);
		socket.emit('getMessages',{from:me._id,to:$scope.peer._id});
	};


	$scope.sendReq=function()
	{
		socket.emit('sendReq',{from:me._id,to:$scope.peer._id});
		$scope.status=1;
	};
	$scope.cancelReq=function()
	{
		socket.emit('cancelReq',{from:me._id,to:$scope.peer._id});
		$scope.status=0;
	};
	$scope.acceptReq=function()
	{
		socket.emit('acceptReq',{from:me._id,to:$scope.peer._id});
		$scope.status=3;
	};
	$scope.rejectReq=function()
	{
		socket.emit('rejectReq',{from:me._id,to:$scope.peer._id});
		$scope.status=0;
	};

	$scope.$watch(function($scope)
	{
		return $scope.peer;
	},function(newVal,oldVal)
	{
		var me=JSON.parse(localStorage.getItem('data'));
		user.getOne({id:me.username},function(res)
		{
			var me=res.body;
			var found= _.findWhere(me.peers,
				{
					peerid:$scope.peer._id
				});
			if(found)
			{
				$scope.status=found.status;
				if($scope.status==3)
				{
					socket.emit('readMessages',{from:me._id,to:$scope.peer._id});
					socket.emit('getMessages',{from:me._id,to:$scope.peer._id});
					console.log('messages requested');
				}
			}
		});
	});

	socket.on('newMessages',function(data)
	{
		console.log('newMessages');
		if($scope.peer._id==data[0].to || $scope.peer._id==data[0].from)
		{
			socket.emit('readMessages',{from:me._id,to:$scope.peer._id});
		}
		$scope.$evalAsync(function()
		{
			$scope.messages= _.sortBy(data,function(msg)
			{
				return (new Date().getTime())-(new Date(msg.time)).getTime();
			});

			$scope.count={};
			_.each(_.reject($scope.messages,{from:me._id}) ,function(msg)
			{
				if(!msg.read)
				{
					$scope.count[msg.from] ? $scope.count[msg.from]++ : $scope.count[msg.from]=1;
				}
			});
		});
	});
}]);