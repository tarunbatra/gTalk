signUp.controller('signUpController', ['$scope', 'alertService', 'apiService', function($scope, alert, user) {
  $scope.register = function() {
    console.log('Registering...');
    if ($scope.username.length < 5) {
      alert.show('Username should be 5 characters minimum');
    } else if ($scope.password.length < 8) {
      alert.show('Password should be 8 characters minimum');
    } else if ($scope.password == $scope.password2) {
      var data = {
        username: $scope.username,
        password: $scope.password
      };
      user.signUp(data, function(res) {
        console.log('callback');
        console.log(res.body);
        if (res.body) {
          console.log(res.body);
          localStorage.setItem('data', JSON.stringify(res.body));
          location.href = '#home';
        } else {
          alert.show(res.messages);
        }
      });
    } else {
      alert.show('Passwords don\'t match');
    }

    $scope.username = '';
    $scope.password = '';
    $scope.password2 = '';
  };
}]);
