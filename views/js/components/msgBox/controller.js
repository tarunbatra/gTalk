msgBox.controller('msgBoxController',['$scope','apiService','socketService',function($scope,user,socket)
{
    console.log('msgBoxController');
	var me=JSON.parse(localStorage.getItem('data'));

	$scope.send=function(msg)
	{
		var obj=
		{
			from    :   me,
			to      :   $scope.peer,
			msg     :   msg,
			time    :   (new Date()).getTime()
		};
		socket.emit('newMessage',obj);
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
		if(!newVal.username)
		{
			return;
		}
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
				$scope.status=3;
				console.log(found);
				$scope.messages=found.messages;

			}
			else
			{
				console.log('not peer');
				$scope.status=0;
			}
		});
	});

}]);