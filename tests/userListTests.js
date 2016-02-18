describe('userListTests', function() {
  beforeEach(module('app.core'));
  beforeEach(module('userList'));

  module(function($provide) {
    $provide.service('notificationService', function() {
      return {
        show: function(msg) {
          console.log('notif : ' + msg);
        },
        userAway: true
      }
    });
  });
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
        getOne: save,
        getAll: save
      };
    }]);
  });



  describe('handle user notif and unread counts', function() {
    var $scope, $rootScope, $controller;
    beforeEach(function() {
      inject(function(_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_('userListController', {
          $scope: $scope
        });
      })
    });

    it("selected user should be active", function() {
      $scope.me = {
        username: 'tbking',
        peers: []
      };
      var dummyUser = {
        _id: 123456789,
        notify: true
      };
      $scope.selected(dummyUser);
      expect(dummyUser).toEqual($scope.active);
    });
    it("active users's notification should not appear", function() {
      $scope.me = {
        username: 'tbking',
        peers: []
      };
      var dummyUser = {
        _id: 123456789,
        notify: true
      };
      $scope.selected(dummyUser);
      expect(dummyUser.notify).toBeUndefined();
    });
    it("active users's unread count should not appear", function() {
      $scope.me = {
        username: 'tbking',
        peers: []
      };
      var dummyUser = {
        _id: 123456789,
        unread: 9
      };
      $scope.selected(dummyUser);
      expect(dummyUser.unread).toBeUndefined();
    });
  });
});
