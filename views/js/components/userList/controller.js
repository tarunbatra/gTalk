userList.controller('userListController', ['$scope', 'apiService', 'socketService', function($scope, user, socket) {
  $scope.active = {};
  var me = JSON.parse(localStorage.getItem('data'));
  user.getAll(function(res) {
    $scope.users = _.reject(res.body, {
      username: me.username
    });
  });

  $scope.selected = function(u) {
    user.getOne({
      id: me.username
    }, function(res) {
      me = res.body;
      $scope.$evalAsync(function()
      {
        $scope.active = u;
      })
      var peer = _.findWhere(me.peers, {
        peerid: u._id
      });
      $scope.code = peer ? peer.status : 0;
      delete u.notify;
      delete u.unread;
    });

  };

  $scope.$watch(function() {
      return $scope.unread;
    },
    function(newVal, oldVal) {
      _.each($scope.users, function(user) {
        if (user._id != $scope.active._id)
          user.unread = newVal[user._id] ? newVal[user._id] : 0;
      });
    });

  socket.on('notification', function(data) {
    $scope.$evalAsync(function() {
      me = JSON.parse(localStorage.getItem('data'));
      user.getOne({
        id: me.username
      }, function(res) {
        me = res.body;
        $scope.users = _.reject(data.users, {
          _id: me._id
        });
        _.each($scope.users, function(u) {
          if (u._id == data.cause) {
            if ($scope.active._id != u._id) {
              u.notify = true;
            }
            if (data.code) {
              $scope.code = data.code;
            }
            if ($scope.active._id == u._id) {
              $scope.active = u;
            }
          }
        });
      });

    });
  });

}]);
