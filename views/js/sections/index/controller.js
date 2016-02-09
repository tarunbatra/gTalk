index.controller('indexController',['$scope', function ($scope)
{
    console.log('indexController');

    if(localStorage.getItem('data'))
    {
        location.href='#home';
    }
    $scope.login=true;
    console.log($scope.data);

}]);