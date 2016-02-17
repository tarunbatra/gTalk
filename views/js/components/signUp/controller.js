signUp.controller('signUpController', ['$scope', 'alertService', 'apiService', function($scope, alert, user) {
  $scope.warning = '';
  $scope.register = function() {
    $scope.warning='';
    if ($scope.username.length < 5) {
      $scope.warning = 'Username should be 5 characters minimum';
    } else if ($scope.password.length < 8) {
      $scope.warning = 'Password should be 8 characters minimum';
    } else if ($scope.password == $scope.password2) {
      var data = {
        username: $scope.username,
        password: $scope.password
      };
      user.signUp(data, function(res) {
        if (res.body) {
          localStorage.setItem('data', JSON.stringify(res.body));
          location.href = '#home';
        } else {
          $scope.warning = res.messages;
        }
      });
    } else {
      $scope.warning = 'Passwords don\'t match';
    }
    $scope.username = '';
    $scope.password = '';
    $scope.password2 = '';
    if ($scope.warning) alert.show($scope.warning);
  };
}]);
