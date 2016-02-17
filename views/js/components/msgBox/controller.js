msgBox.controller('msgBoxController', ['$scope', 'apiService', 'socketService', function($scope, user, socket) {

  //initialization
  $scope.messages = [];
  $scope.me = JSON.parse(localStorage.getItem('data'));
  user.getOne({
    id: $scope.me.username
  }, function(res) {
    $scope.me = res.body;
  });
  //function to send messsage
  $scope.send = function() {
    if (!$scope.msg) return;
    var obj = {
      from: $scope.me._id,
      to: $scope.peer._id,
      msg: $scope.msg,
      time: (new Date()).getTime()
    };
    socket.emit('addMessage', obj);
    $scope.msg = '';
    $scope.messages.push(obj);
    socket.emit('getMessages', {
      from: $scope.me._id,
      to: $scope.peer._id
    });
    scrollToBottom(5);
  };
  //function to send request
  $scope.sendReq = function() {
    socket.emit('sendReq', {
      from: $scope.me._id,
      to: $scope.peer._id
    });
    $scope.status = 1;
  };
  //function to cancel request
  $scope.cancelReq = function() {
    socket.emit('cancelReq', {
      from: $scope.me._id,
      to: $scope.peer._id
    });
    $scope.status = 0;
  };
  //function to accept request
  $scope.acceptReq = function() {
    socket.emit('acceptReq', {
      from: $scope.me._id,
      to: $scope.peer._id
    });
    $scope.status = 3;
  };
  //function to reject request
  $scope.rejectReq = function() {
    socket.emit('rejectReq', {
      from: $scope.me._id,
      to: $scope.peer._id
    });
    $scope.status = 0;
  };
  //function to watch change in selected user
  $scope.$watch(function($scope) {
    return $scope.peer;
  }, function(newVal, oldVal) {
    $scope.me = JSON.parse(localStorage.getItem('data'));
    user.getOne({
      id: $scope.me.username
    }, function(res) {
      $scope.me = res.body;
      var found = _.findWhere($scope.me.peers, {
        peerid: $scope.peer._id
      });
      //if the active user is a peer of the current user
      if (found) {
        $scope.status = found.status;
        if ($scope.status == 3) {
          scrollToBottom(5);
          socket.emit('getMessages', {
            from: $scope.me._id,
            to: $scope.peer._id
          });
        }
      } else {
        $scope.status = 0;
      }
    });
  });
  //handler to receive new messages
  socket.on('newMessages', function(data) {
    if (!data.length) return;
    if ($scope.peer._id == data[0].to || $scope.peer._id == data[0].from) {
      $scope.$evalAsync(function() {
        $scope.messages = data;
        console.log('new messages');
        scrollToBottom(5);
      });
      socket.emit('readMessages', {
        from: $scope.peer._id,
        to: $scope.me._id
      });
    } else {
      $scope.count = {};
      var messages = data;
      _.each(_.reject(messages, {
        from: me._id
      }), function(msg) {
        if (!msg.read) {
          $scope.$evalAsync(function() {
            $scope.count[msg.from] ? $scope.count[msg.from]++ : $scope.count[msg.from] = 1;
          })
        }
      });
    }
  });
}]);
//function to scroll to bottom
var scrollToBottom = function(n) {
  var d = document.getElementById('msgDiv');
  if (d.scrollHeight > d.clientHeight) {
    d.scrollTop = d.scrollHeight - d.clientHeight;
    if (n) {
      setTimeout(function() {
        scrollToBottom(n - 1);
      }, 50);
    }
  }
};
