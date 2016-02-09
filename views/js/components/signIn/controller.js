signIn.controller('signInController',['$scope','apiService',function($scope,user)
{
    console.log('signInController');
    $scope.login=function()
    {
        console.log('Logging in...');

        var data={username:$scope.username,password:$scope.password};
        user.signIn(data,function(res)
        {
            console.log('callback');
            if(res.body)
            {
                console.log(res.body)
                localStorage.setItem('data',JSON.stringify(res.body));
                location.href='#home';
            }
            $scope.username='';
            $scope.password='';
        });

    };
}]);