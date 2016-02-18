signIn.controller('signInController', ['$scope', 'alertService', 'apiService', 'validationService', function($scope, alert, user, validate) {
  $scope.login = function() {
    var signInData = validate.signIn($scope.formData);
    console.log(signInData);
    if (signInData.isValid) {
      user.signIn($scope.formData, function(res) {
        if (res.body) {
          localStorage.setItem('data', JSON.stringify(res.body));
          location.href = '#home';
        } else {
          alert.show(res.messages);
        }
      });
    } else {
      alert.show(signInData.warning);
    }
  };
}]);
