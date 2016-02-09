msgBox.controller('msgBoxController',['$scope','apiService',function($scope,$window,user)
{
    console.log('signInController');
    $scope.login=function()
    {
        var data={username:$scope.username,password:$scope.password};
        user.signIn(data,function(res)
        {
            if(res.body)
            {
                console.log(res.body)
                localStorage.setItem('data',JSON.stringify(res.body));
                location.href='#home';
            }
            else
            {
                $scope.username='';
                $scope.password='';
                $window.alert('Try again.');
            }
        });

    };
}]);