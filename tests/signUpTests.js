describe('signUpTest', function() {
  beforeEach(module('app.core'));
  beforeEach(module('signUp'));

  var $controller;

  module(function($provide) {
    $provide.service('alertService', function() {
      return {
        show: function(msg) {
          console.log(msg);
        }
      };
    });
  });
  module(function($provide) {
    $provide.factory('apiService', ['$q', function($q) {
      function save(data) {
        if (passPromise) {
          return $q.when();
        } else {
          return $q.reject();
        }
      }
      return {
        signIn: save
      };
    }]);
  });


  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('username should be 5 characters minimum', function() {
    it('less than 5 should not work', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username = '1234';
      $scope.register();
      expect($scope.warning).toBe('Username should be 5 characters minimum');
    });
    it('greater than equal to 5 should work', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password = '12345';
      $scope.register();
      expect($scope.warning).not.toBe('Username should be 5 characters minimum');
    });
  });
  describe('password should be 8 characters minimum', function() {
    it('less than 8 should not work', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password = '12345';
      $scope.register();
      expect($scope.warning).toBe('Password should be 8 characters minimum');
    });
    it('greater than equal to 8 should work', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password = '12345678';
      $scope.password = '12345678';
      $scope.register();
      expect($scope.warning).not.toBe('Password should be 8 characters minimum');
    });
  });
  describe('passwords should match', function() {
    it('if passwords don\'t match show warning', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username='12345';
      $scope.password = 'password';
      $scope.password2 = 'password2';
      $scope.register();
      expect($scope.warning).toBe('Passwords don\'t match');
    });
    it('if passwords match good to go', function() {
      var $scope = {};
      var controller = $controller('signUpController', {
        $scope: $scope
      });
      $scope.username='12345';
      $scope.password = 'password';
      $scope.password2 = 'password';
      $scope.register();
      expect($scope.warning).not.toBe('Passwords don\'t match');
    });
  });
});
