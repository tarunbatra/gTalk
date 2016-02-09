home.controller('homeController',['$scope', function ($scope)
{
    console.log('homeController');

    if(!localStorage.getItem('data'))
    {
        location.href='#index';
    }

}]);