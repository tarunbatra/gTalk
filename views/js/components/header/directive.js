header.directive('header', ['socketService', function(socket) {
  return {
    templateUrl: 'js/components/header/template.html',
    link: function(s) {
      s.user = JSON.parse(localStorage.getItem('data'));
      s.logout = function() {
        s.destroySocket();
        localStorage.removeItem('data');
        location.href = '#index';
      };

      s.destroySocket = function() {
        console.log(s.user);
        socket.emit('disconnection', s.user.username);
      };

      $(window).on('beforeunload', function() {
        s.destroySocket();
      });
    }
  };
}]);
