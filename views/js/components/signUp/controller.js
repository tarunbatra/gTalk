signUp.controller('signUpController', ['$scope', 'alertService', 'apiService', 'validationService', function($scope, alert, user, validator) {
  $scope.register = function() {
    var signUpData = validator.signUp($scope.formData);
    if (signUpData.isValid) {
      user.signUp($scope.formData, function(res) {
        if (res.body) {
          localStorage.setItem('data', JSON.stringify(res.body));
          location.href = '#home';
        } else {
          alert.show(res.messages);
        }
      });
    } else {
      alert.show(signUpData.warning);
    }
  };
}]);
