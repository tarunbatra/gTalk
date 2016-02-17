signIn.controller('signInController', ['$scope', 'alertService', 'apiService', function($scope, alert, user) {
  $scope.warning = '';
  $scope.login = function() {
    if ($scope.username.length < 5) {
      $scope.warning = 'Username should be 5 characters minimum';
    } else if ($scope.password.length < 8) {
      $scope.warning = 'Password should be 8 characters minimum';
    } else {
      var data = {
        username: $scope.username,
        password: $scope.password
      };
      user.signIn(data, function(res) {
        if (res.body) {
          localStorage.setItem('data', JSON.stringify(res.body));
          location.href = '#home';
        } else {
          $scope.warning = res.messages;
        }
      });
    }
    $scope.username = '';
    $scope.password = '';
    if ($scope.warning) alert.show($scope.warning);
    $scope.warning='';
  };
}]);
