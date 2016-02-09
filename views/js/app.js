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
                templateUrl :   'js/sections/index/template.html'
            })
        .when('/home',
            {
                controller  :   'homeController',
                templateUrl :   'js/sections/home/template.html'
            })
        .otherwise
        ({
            redirectTo:'/index'
        });
}]);
