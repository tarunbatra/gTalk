describe('appTest', function() {
  beforeEach(module('app.core'));
  beforeEach(module('app.components'));
  beforeEach(module('app.sections'));
  beforeEach(module('ngRoute'));
  beforeEach(module('app'));

  var $controller;


  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('zIs1', function() {
    it('z should be 1', function() {
      var $scope = {};
      var controller = $controller('appController', {
        $scope: $scope
      });
      expect($scope.z).toBe(1);
    });
  });
});
