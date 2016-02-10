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
		console.log(data.users);
		$scope.$evalAsync(function()
		{
			$scope.users=data.users;
			$scope.users= _.reject($scope.users,{username:me.username});
			_.each($scope.users,function(u)
			{
				if(u.username==data.cause)
				{
					u.notify=true;
					if(data.code)
					{
						$scope.code=data.code;
					}
					if(u.username==$scope.active.username)
					{
						$scope.$evalAsync(function()
						{
							$scope.active=u;
						});
					}
				}
			});
		});
	});

}]);