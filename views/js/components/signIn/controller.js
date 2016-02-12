signIn.controller('signInController',['$scope','alertService','apiService',function($scope,alert,user)
{
    console.log('signInController');
    $scope.login=function()
    {
	    if($scope.username.length<5)
	    {
		    alert.show('Username should be 5 characters minimum');
	    }
	    else if($scope.password.length<8)
	    {
		    alert.show('Password should be 8 characters minimum');
	    }
	    else
	    {
		    var data={username:$scope.username,password:$scope.password};
		    user.signIn(data,function(res)
		    {
			    if(res.body)
			    {
				    localStorage.setItem('data',JSON.stringify(res.body));
				    location.href='#home';
			    }
			    else
			    {
				    $scope.username='';
				    $scope.password='';
				    alert.show('Try again');
			    }
		    });
	    }
    };
}]);