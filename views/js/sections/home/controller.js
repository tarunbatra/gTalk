home.controller('homeController', ['$scope', 'apiService', 'socketService', 'checkSession', function($scope, user, socket) {
  try {
    $scope.me = JSON.parse(localStorage.getItem('data'));
    user.auth($scope.me, function(res) {
      if (!res.body.authenticated) {
        localStorage.removeItem('data');
        location.href = '#index';
      } else {
        user.getOne({
          id: $scope.me.username
        }, function(res) {
          socket.emit('connection', res.body);
        });
      }
    });
  } catch (e) {
    localStorage.removeItem('data');
    location.href = '#index';
  }
}]);
