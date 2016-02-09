userList.controller('userListController',['$scope','apiService',function($scope,user)
{
    console.log('userListController');
	user.getAll(function(res)
	{
		$scope.users=res.body;
	});
	$scope.selected=function(u)
	{
		u.active=true;
	};

}]);