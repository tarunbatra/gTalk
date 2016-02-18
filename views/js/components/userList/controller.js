userList.controller('userListController', ['$scope', 'apiService', 'socketService', 'notificationService', function($scope, user, socket, notification) {
  $scope.active = {};
  $scope.me = JSON.parse(localStorage.getItem('data'));
  user.getAll(function(res) {
    $scope.users = _.reject(res.body, {
      username: $scope.me.username
    });
  });
  //function to select a user
  $scope.selected = function(u) {
    //if the user is active, no notification and unread msgs
    delete u.notify;
    delete u.unread;
    $scope.active = u;
    //update current user's data
    user.getOne({
      id: $scope.me.username
    }, function(res) {
      $scope.me = res.body;
      //update the active user
      $scope.$evalAsync(function() {
          $scope.active = u;
        })
        //retreive the peer entry of active user
      var peer = _.findWhere($scope.me.peers, {
        peerid: u._id
      });
      //update code of active user
      $scope.code = peer ? peer.status : 0;

      scrollToBottom(5);
    });
  };
  //function to watch change in unread messages
  $scope.$watch(function() {
      return $scope.unread;
    },
    function(newVal, oldVal) {
      _.each($scope.users, function(user) {
        if (user._id != $scope.active._id) {
          user.unread = newVal[user._id] ? newVal[user._id] : 0;
          if (user.unread)
            notification.show('Unread Messages!', 'You have ' + user.unread + ' unread messages from ' + user.username);
        }
      });
    });
  //handler to receive notifications
  socket.on('notification', function(data) {
    $scope.me = JSON.parse(localStorage.getItem('data'));
    $scope.$evalAsync(function() {
      $scope.users = _.reject(data.users, {
        username: $scope.me.username
      });
      //checking notifications for each user
      _.each($scope.users, function(u) {
        if (u._id == data.cause) {
          if ($scope.active._id != u._id) {
            u.notify = true;
          }
          else{
            $scope.active = u;
            if (data.code) {
              $scope.code = data.code;
            }
          }
          notification.show('New Notification!', 'You have a new notification from ' + u.username);
        }
      });
    });
    //get initial msg data for unread count
    user.getOne({
      id: $scope.me.username
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
