index.controller('indexController', ['$scope', 'checkSession', function($scope) {
  console.log('indexController');
  $scope.login = true;
  console.log($scope.data);

}]);
