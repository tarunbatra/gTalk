userList.controller('userListController',['$scope','apiService','socketService',function($scope,user,socket)
{
	$scope.active={};
    console.log('userListController');
	var me=JSON.parse(localStorage.getItem('data'));
	user.getAll(function(res)
	{
		$scope.users=res.body;
		$scope.users= _.reject($scope.users,{username:me.username});
	});
	$scope.selected=function(u)
	{
		$scope.active=u;
		delete u.notify;
	};

	socket.on('notification',function(data)
	{
		console.log('notification');
		$scope.$evalAsync(function()
		{
			var myAcc=_.findWhere(data.users,{username:me.username});
			$scope.users= _.reject(data.users,{username:me.username});
			_.each($scope.users,function(u)
			{
				if(u.username==data.cause)
				{
					if($scope.active.username!=data.cause)
					{
						u.notify=true;
					}
					if(data.code)
					{
						$scope.code=data.code;
					}
					if($scope.active.username== u.username)
					{
						$scope.$evalAsync(function()
						{
							$scope.active=u;
						});
					}
				}
				var peer= _.findWhere(u.peers,{peerid:myAcc._id});
				_.each(peer.messages,function(msg)
				{
					u.count=0;
					if(!msg.read)
					{
						u.count++;
					}
				});

			});
		});
	});

}]);