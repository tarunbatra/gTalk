var app=angular.module('app',['ngRoute','app.sections','app.core','app.components']);

app.controller('appController',['$scope',function($scope)
{
    console.log('appController');
}]);


app.config(['$routeProvider',function($routeProvider)
{
    $routeProvider
        .when('/index',
            {
                controller  :   'indexController',
                templateUrl :   'js/sections/index/template.html',
                resolve     :
                {
                    checkSession:function()
                    {

                        if(localStorage.getItem('data'))
                        {
                            location.href='#home';
                        }
                    }
                }
            })
        .when('/home',
            {
                controller  :   'homeController',
                templateUrl :   'js/sections/home/template.html',
                resolve     :
                {
                    checkSession:function()
                    {

                        if(!localStorage.getItem('data'))
                        {
                            location.href='#index';
                        }
                    }
                }
            })
        .otherwise
        ({
            redirectTo:'/index'
        });
}]);
