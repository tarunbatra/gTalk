msgBox.controller('msgBoxController',['$scope','apiService','socketService',function($scope,user,socket)
{
    console.log('msgBoxController');
	var me=JSON.parse(localStorage.getItem('data'));

	$scope.send=function()
	{
		if(!$scope.msg) return;
		var obj=
		{
			from    :   me.username,
			to      :   $scope.peer,
			msg     :   $scope.msg,
			time    :   (new Date()).getTime()
		};
		console.log(obj);
		socket.emit('newMessage',obj);
		$scope.msg='';
		$scope.messages.unshift(obj);
	};


	$scope.sendReq=function()
	{
		socket.emit('sendReq',{from:me.username,to:$scope.peer});
		$scope.status=1;
	};
	$scope.cancelReq=function()
	{
		socket.emit('cancelReq',{from:me.username,to:$scope.peer});
		$scope.status=0;
	};
	$scope.acceptReq=function()
	{
		socket.emit('acceptReq',{from:me.username,to:$scope.peer});
		$scope.status=3;
	};
	$scope.rejectReq=function()
	{
		socket.emit('rejectReq',{from:me.username,to:$scope.peer});
		$scope.status=0;
	};


	//watch the changes in selected user form userList
	$scope.$watch(function($scope)
	{
		return $scope.peer;
	},
	function(newVal,oldVal)
	{
		$scope.messages=[];
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
				console.log('found');
				$scope.status=found.status;
				if(found.messages.length)
				{
					$scope.messages=found.messages;
					$scope.messages= _.sortBy($scope.messages,function(message)
					{
						return (new Date())-(new Date(message.time));
					});
				}

			}
			else
			{
				console.log('not peer');
				$scope.status=0;
			}
		});
	});

}]);