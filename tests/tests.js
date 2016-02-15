describe('signInTest', function() {
  beforeEach(module('app.core'));
  beforeEach(module('signIn'));

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
      var controller = $controller('signInController', {
        $scope: $scope
      });
      $scope.username = '1234';
      $scope.login();
      expect($scope.warning).toBe('Username should be 5 characters minimum');
    });
    it('greater than equal to 5 should work', function() {
      var $scope = {};
      var controller = $controller('signInController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password='qqqqqqqqq';
      $scope.login();
      expect($scope.warning).toBe('');
    });
  });
  describe('password should be 8 characters minimum', function() {
    it('less than 8 should not work', function() {
      var $scope = {};
      var controller = $controller('signInController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password='12345';
      $scope.login();
      expect($scope.warning).toBe('Password should be 8 characters minimum');
    });
    it('greater than 8 should work', function() {
      var $scope = {};
      var controller = $controller('signInController', {
        $scope: $scope
      });
      $scope.username = '12345';
      $scope.password='12345678';
      $scope.login();
      expect($scope.warning).toBe('');
    });
  });
});
