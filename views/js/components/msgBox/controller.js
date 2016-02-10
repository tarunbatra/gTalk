msgBox.controller('msgBoxController',['$scope','apiService','socketService',function($scope,user,socket)
{
    console.log('msgBoxController');
	var me=JSON.parse(localStorage.getItem('data'));

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
	},function(newVal,oldVal)
	{
		if(!newVal.username)
		{
			return;
		}
		var me=JSON.parse(localStorage.getItem('data'));
		user.getOne({id:me.username},function(res)
		{
			var me=res.body;

			/*
				see if the user selected is a peer or not?
				0:no
				1:request sent
				2:request received
				3:approved
			 */

			var found= _.findWhere(me.peers,{peerid:$scope.peer._id});
			if(found)
			{
				console.log('found');
				$scope.status=found.status;
			}
			else
			{
				console.log('not peer');
				$scope.status=0;
			}
		});
	});

}]);