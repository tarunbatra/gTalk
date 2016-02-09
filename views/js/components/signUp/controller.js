signUp.controller('signUpController',['$scope','$window','apiService',function($scope,$window,user)
{
    console.log('signUpController');
    $scope.register=function()
    {
        console.log('Registering...');
        if($scope.password==$scope.password2)
        {
            var data = {username: $scope.username, password: $scope.password};
            user.signUp(data, function (res)
            {
                console.log('callback');
                console.log(res.body);
                if (res.body)
                {
                    console.log(res.body);
                    localStorage.setItem('data',JSON.stringify(res.body));
                    location.href = '#home';
                }
            });
        }
        else
        {
            console.log('Passwords mismatch');
            $scope.username = '';
            $scope.password = '';
            $scope.password2 = '';
            $window.alert('Passwords don\'t match');
        }
    };
}]);