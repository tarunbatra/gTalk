userList.controller('userListController', ['$scope', 'apiService', 'socketService', function($scope, user, socket) {
  $scope.active = {};
  var me = JSON.parse(localStorage.getItem('data'));
  user.getAll(function(res) {
    $scope.users = _.reject(res.body, {
      username: me.username
    });
  });
  //function to select a user
  $scope.selected = function(u) {
    //update current user's data
    user.getOne({
      id: me.username
    }, function(res) {
      me = res.body;
      //update the active user
      $scope.$evalAsync(function() {
          $scope.active = u;
        })
        //retreive the peer entry of active user
      var peer = _.findWhere(me.peers, {
        peerid: u._id
      });
      //update code of active user
      $scope.code = peer ? peer.status : 0;
      //if the user is active, no notification and unread msgs
      delete u.notify;
      delete u.unread;
    });
  };
  //function to watch change in unread messages
  $scope.$watch(function() {
      return $scope.unread;
    },
    function(newVal, oldVal) {
      _.each($scope.users, function(user) {
        if (user._id != $scope.active._id)
          user.unread = newVal[user._id] ? newVal[user._id] : 0;
      });
    });
  //handler to receive notifications
  socket.on('notification', function(data) {
    me = JSON.parse(localStorage.getItem('data'));
    $scope.$evalAsync(function() {
      $scope.users = _.reject(data.users, {
        username: me.username
      });
      //checking notifications for each user
      _.each($scope.users, function(u) {
        if (u._id == data.cause) {
          if ($scope.active._id != u._id) {
            u.notify = true;
          }
          //assigning code to each user : 0:not connected ; 1:request sent ; 2:request received ; 3:request accepted
          if (data.code) {
            $scope.code = data.code;
          }
          //updating active user
          if ($scope.active._id == u._id) {
            $scope.active = u;
          }
        }
      });
    });
    //get initial msg data for unread count
    user.getOne({
      id: me.username
    }, function(res) {
      myAcc = res.body;
      _.each($scope.users, function(u) {
        var found = _.findWhere(myAcc.peers, {
          peerid: u._id
        });
        if (found && found.status == 3) {
          socket.emit('getMessages', {
            from: myAcc._id,
            to: u._id
          });
        }
      });
    });
  });
}]);
