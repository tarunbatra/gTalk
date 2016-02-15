/*
describe('homeTest', function () {

  beforeEach(module('home'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('signed in', function () {
    it('signed in user should have an entry in localstorage', function () {
      var $scope = {};
      var controller = $controller('homeController', { $scope: $scope });

      expect($scope.me).toBeTruthy();
    });

    it('localstorage entry should be valid', function () {
      var $scope = {};
      var controller = $controller('homeController', { $scope: $scope });
      expect($scope.me.username.toBeDefined());
      expect($scope.me.token.toBeDefined());
      expect($scope.me._id.toBeDefined());
    });
  });

});
*/
