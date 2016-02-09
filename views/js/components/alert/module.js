var alert=angular.module('alert',['showAlert']);

alert.controller('alertController',['$scope','showAlertService',function($scope,showAlertService)
{
    //$scope.alert=showAlertService;
    //$scope.strong=showAlertService.strong;
    //$scope.text=showAlertService.text;
}]);

alert.directive('alertDirective',function()
{
    return{
        templateUrl:'modules/alert/alert.html'
    };
});