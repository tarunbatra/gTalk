/*
describe('msgBoxTests', function() {
  beforeEach(module('app.core'));
  beforeEach(module('msgBox'));

  module(function($provide) {
    $provide.service('socketService', function() {
      return {
        on: function(msg) {
          console.log('on : ' + msg);
        },
        emit: function(msg) {
          console.log('emit : ' + msg);
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
        getOne: save
      };
    }]);
  });

  describe('set status appropriately', function() {
    var $scope, $rootScope, $controller;
    beforeEach(function() {
      inject(function(_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_('msgBoxController', {
          $scope: $scope
        });
      })
    });

    it('status should be 1 after sending request', function() {
      $scope.me = {
        _id: 123456789,
        username: 'tbking',
        peers: []
      };
      $scope.peer = {
        _id: 987654321,
        username: 'tbpeer',
        peers: []
      };
      $scope.sendReq();
      expect($scope.status).toEqual(1);
    });
    it('status should be 0 after canceling request', function() {
      $scope.me = {
        _id: 123456789,
        username: 'tbking',
        peers: []
      };
      $scope.peer = {
        _id: 987654321,
        username: 'tbpeer',
        peers: []
      };
      $scope.cancelReq();
      expect($scope.status).toEqual(0);
    });
    it('status should be 3 after accepting request', function() {
      $scope.me = {
        _id: 123456789,
        username: 'tbking',
        peers: []
      };
      $scope.peer = {
        _id: 987654321,
        username: 'tbpeer',
        peers: []
      };
      $scope.acceptReq();
      expect($scope.status).toEqual(3);
    });
    it('status should be 0 after rejecting request', function() {
      $scope.me = {
        _id: 123456789,
        username: 'tbking',
        peers: []
      };
      $scope.peer = {
        _id: 987654321,
        username: 'tbpeer',
        peers: []
      };
      $scope.rejectReq();
      expect($scope.status).toEqual(0);
    });
  });
});
  */